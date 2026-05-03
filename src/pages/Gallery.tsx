import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Folder, FolderPlus, ChevronLeft, Link as LinkIcon, FolderUp, Edit2, Trash2 } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, logAudit } from '../firebase';

interface GalleryFolder {
  id: string;
  name: string;
  thumbnail?: string;
  created_at?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  folder_id: string | null;
  created_at?: string;
}

export default function Gallery() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<GalleryFolder | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveLink, setDriveLink] = useState('');
  const [driveImageTitle, setDriveImageTitle] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const foldersQuery = query(collection(db, 'folders'), orderBy('created_at', 'desc'));
    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      const foldersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GalleryFolder));
      setFolders(foldersData);
    }, (error) => {
      console.error('Firestore Error fetching folders: ', error);
    });

    return () => unsubscribeFolders();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let imagesQuery;
    if (currentFolder) {
      imagesQuery = query(collection(db, 'images'), where('folder_id', '==', currentFolder.id));
    } else {
      imagesQuery = query(collection(db, 'images'), where('folder_id', '==', null));
    }

    const unsubscribeImages = onSnapshot(imagesQuery, (snapshot) => {
      const imagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GalleryImage));
      
      // Sort in memory to avoid requiring a composite index in Firestore
      imagesData.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // descending
      });
      
      setImages(imagesData);
      setLoading(false);
    }, (error) => {
      console.error('Firestore Error fetching images: ', error);
      setLoading(false);
    });

    return () => unsubscribeImages();
  }, [currentFolder, user]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        try {
          const base64Url = await compressImage(file);
          const title = file.name || 'New Uploaded Image';
          
          await addDoc(collection(db, 'images'), {
            url: base64Url,
            title,
            folder_id: currentFolder ? currentFolder.id : null,
            created_at: new Date().toISOString()
          });
          await logAudit('UPLOAD_IMAGE', `Uploaded image "${title}"`);
        } catch (error) {
          console.error('Error processing image:', error);
          setAlertMessage('Failed to process image. If using an iPhone, try changing your camera settings to "Most Compatible" (JPEG) instead of High Efficiency (HEIC).');
        }
      }
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(file => {
        const isImageMime = file.type.startsWith('image/');
        const isImageExt = /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name);
        return isImageMime || isImageExt;
      });
      
      if (files.length === 0) {
        setAlertMessage('No images found in the selected folder.');
        return;
      }

      setIsImporting(true);
      try {
        let targetFolderId = currentFolder?.id;
        
        // If we are not currently in a folder, create one based on the uploaded folder's name
        if (!targetFolderId) {
          const folderName = files[0].webkitRelativePath.split('/')[0] || 'Uploaded Folder';
          const docRef = await addDoc(collection(db, 'folders'), {
            name: folderName,
            created_at: new Date().toISOString()
          });
          await logAudit('CREATE_FOLDER', `Created folder "${folderName}" for upload`);
          
          targetFolderId = docRef.id;
          setCurrentFolder({ id: docRef.id, name: folderName }); // Automatically navigate to the new folder
        }

        let uploadedCount = 0;
        for (const file of files) {
          try {
            const base64Url = await compressImage(file);
            const title = file.name;
            
            await addDoc(collection(db, 'images'), {
              url: base64Url,
              title,
              folder_id: targetFolderId || null,
              created_at: new Date().toISOString()
            });
            uploadedCount++;
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
        setAlertMessage(`Successfully uploaded ${uploadedCount} images.`);
        await logAudit('UPLOAD_FOLDER', `Uploaded ${uploadedCount} images to folder`);
      } catch (error) {
        console.error('Error uploading folder:', error);
        setAlertMessage('An error occurred while uploading the folder.');
      } finally {
        setIsImporting(false);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleDriveImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveLink.trim()) return;

    // Check if it's a folder link
    if (driveLink.includes('/folders/') || driveLink.includes('folderview')) {
      setAlertMessage('Google Drive folder links cannot be imported directly due to Google security restrictions. Please use the "Upload Folder" button instead and select the folder from your computer.');
      return;
    }

    setIsImporting(true);
    try {
      // Extract file ID from Google Drive link
      let fileId = '';
      const dMatch = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const idMatch = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      
      if (dMatch && dMatch[1]) {
        fileId = dMatch[1];
      } else if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      } else {
        fileId = driveLink.trim(); // Assume they just pasted the ID
      }

      if (!fileId) {
        setAlertMessage('Could not extract a valid Google Drive File ID from the link.');
        setIsImporting(false);
        return;
      }

      // Create a direct download URL
      const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      const title = driveImageTitle.trim() || 'Google Drive Image';

      await addDoc(collection(db, 'images'), {
        url: directUrl,
        title,
        folder_id: currentFolder ? currentFolder.id : null,
        created_at: new Date().toISOString()
      });
      await logAudit('IMPORT_DRIVE_IMAGE', `Imported image "${title}" from Google Drive`);
      
      setIsDriveModalOpen(false);
      setDriveLink('');
      setDriveImageTitle('');
    } catch (error) {
      console.error('Error importing from Drive:', error);
      setAlertMessage('An error occurred while importing the image.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await addDoc(collection(db, 'folders'), {
        name: newFolderName.trim(),
        created_at: new Date().toISOString()
      });
      await logAudit('CREATE_FOLDER', `Created folder "${newFolderName.trim()}"`);
      setIsCreatingFolder(false);
      setNewFolderName('');
    } catch (e) {
      console.error('Failed to create folder', e);
    }
  };

  const removeFolder = async (id: string) => {
    try {
      const folder = folders.find(f => f.id === id);
      await deleteDoc(doc(db, 'folders', id));
      if (folder) {
        await logAudit('DELETE_FOLDER', `Deleted folder "${folder.name}"`);
      }
      setDeletingFolderId(null);
    } catch (e) {
      console.error('Failed to delete folder', e);
    }
  };

  const handleEditFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFolderName.trim() || editingFolderId === null) return;

    try {
      await updateDoc(doc(db, 'folders', editingFolderId), {
        name: editingFolderName.trim()
      });
      await logAudit('UPDATE_FOLDER', `Renamed folder to "${editingFolderName.trim()}"`);
      setEditingFolderId(null);
      setEditingFolderName('');
    } catch (e) {
      console.error('Failed to update folder', e);
    }
  };

  const removeImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'images', id));
      await logAudit('DELETE_IMAGE', `Deleted image`);
    } catch (e) {
      console.error('Failed to delete image', e);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            {currentFolder && (
              <button 
                onClick={() => setCurrentFolder(null)}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {currentFolder ? currentFolder.name : 'Gallery'}
            </h1>
          </div>
          <p className="text-slate-500 mt-2">
            {currentFolder ? 'Folder contents' : 'Before and after photos of the workplace.'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {!currentFolder && (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="font-medium text-sm">New Folder</span>
            </button>
          )}
          
          <button
            onClick={() => setIsDriveModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="font-medium text-sm">Add from Drive</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
            <FolderUp className="w-4 h-4" />
            <span className="font-medium text-sm">Upload Folder</span>
            <input 
              type="file" 
              accept="image/*" 
              // @ts-ignore - webkitdirectory is non-standard but widely supported
              webkitdirectory="true" 
              directory="true" 
              multiple 
              className="hidden" 
              onChange={handleFolderUpload} 
            />
          </label>

          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            <span className="font-medium text-sm">Upload Images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {isImporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center max-w-sm w-full">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Importing Images</h3>
            <p className="text-sm text-slate-500 text-center">
              Please wait while we process and upload your images. This may take a few moments for large folders.
            </p>
          </div>
        </div>
      )}

      {isDriveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Import from Google Drive</h3>
              <button onClick={() => setIsDriveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleDriveImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Google Drive Link</label>
                <input
                  type="text"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Make sure the file is set to "Anyone with the link can view".
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image Title (Optional)</label>
                <input
                  type="text"
                  value={driveImageTitle}
                  onChange={(e) => setDriveImageTitle(e.target.value)}
                  placeholder="e.g., Floor 1 Before"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!driveLink.trim() || isImporting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                >
                  {isImporting ? 'Importing...' : 'Import Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreatingFolder && (
        <form onSubmit={handleCreateFolder} className="mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsCreatingFolder(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!newFolderName.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
          >
            Create
          </button>
        </form>
      )}

      {!currentFolder && folders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {folders.map(folder => (
              <div 
                key={folder.id}
                onClick={() => setCurrentFolder(folder)}
                className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden h-40"
              >
                <div className="flex-1 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {folder.thumbnail ? (
                    <img src={folder.thumbnail} alt={folder.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Folder className="w-12 h-12 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                  )}
                </div>
                
                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between z-10">
                  {editingFolderId === folder.id ? (
                    <form 
                      onSubmit={handleEditFolder}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center gap-1"
                    >
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                        onBlur={() => setEditingFolderId(null)}
                      />
                    </form>
                  ) : (
                    <span className="font-medium text-slate-700 text-sm truncate flex-1 pr-2">{folder.name}</span>
                  )}
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFolderId(folder.id);
                        setEditingFolderName(folder.name);
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-600 bg-white/80 rounded"
                      title="Edit Folder"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingFolderId(folder.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 bg-white/80 rounded"
                      title="Delete Folder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Folder Confirmation Modal */}
      {deletingFolderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Folder?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this folder? All images inside it will also be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingFolderId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => removeFolder(deletingFolderId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Message Modal */}
      {alertMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Notice</h3>
            <p className="text-sm text-slate-600 mb-6 whitespace-pre-wrap">{alertMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertMessage(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {currentFolder ? 'Images' : (folders.length > 0 ? 'Uncategorized Images' : 'Images')}
        </h2>
        {images.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No images in this folder yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 relative">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-700 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-sm font-medium text-slate-700 truncate" title={img.title}>{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
