import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    Upload,
    CheckCircle2,
    X,
    Eye,
    FileText,
    Image as ImageIcon,
    AlertCircle,
    Loader2,
} from 'lucide-react';

const FileUpload = ({
    onFileSelect,
    acceptedTypes = '.pdf,.jpg,.jpeg,.png',
    maxSize = 10 * 1024 * 1024, // 10MB
    currentFile = null,
    onRemove,
    className,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        if (!file) return { valid: false, error: 'Nenhum arquivo selecionado' };

        // Verificar tipo
        const allowedTypes = acceptedTypes.split(',').map(type => type.trim().toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        const isValidType = allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileName.endsWith(type);
            }
            return fileType.includes(type.replace('.', ''));
        });

        if (!isValidType) {
            return { valid: false, error: `Tipo de arquivo não permitido. Use: ${acceptedTypes}` };
        }

        // Verificar tamanho
        if (file.size > maxSize) {
            return { valid: false, error: `Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(1)} MB` };
        }

        return { valid: true };
    };

    const handleFileSelect = useCallback(async (file) => {
        const validation = validateFile(file);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        setUploading(true);

        // Simular upload
        await new Promise(resolve => setTimeout(resolve, 1000));

        onFileSelect(file);

        // Criar preview se for imagem
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }

        setUploading(false);
    }, [onFileSelect, maxSize, acceptedTypes]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setShowPreview(false);
        onRemove?.();
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return ImageIcon;
        return FileText;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (currentFile) {
        const FileIcon = getFileIcon(currentFile);

        return (
            <Card className={cn("border-2", className)}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <FileIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{currentFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatFileSize(currentFile.size)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {preview && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPreview(true)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Preview Modal */}
                    {showPreview && preview && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h3 className="font-semibold">Preview do Arquivo</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPreview(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="p-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={cn("space-y-2", className)}>
            <Label>Arquivo do Certificado *</Label>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'flex flex-col items-center justify-center gap-4 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-all',
                    dragActive
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    uploading && 'pointer-events-none opacity-50'
                )}
            >
                {uploading ? (
                    <>
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Enviando arquivo...
                        </p>
                    </>
                ) : (
                    <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Clique para fazer upload ou arraste o arquivo
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {acceptedTypes.replace(/\./g, '').toUpperCase()} • Máximo {(maxSize / 1024 / 1024).toFixed(1)} MB
                            </p>
                        </div>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default FileUpload;