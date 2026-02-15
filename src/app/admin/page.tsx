"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, Image as ImageIcon, Music as MusicIcon, Trash2, Plus, X } from 'lucide-react';
import { PostData } from '@/lib/posts';
import { getStaticUrl } from '@/lib/utils';
import { useMusic } from '@/components/music-context';

interface MusicTrack {
    filename: string;
    title?: string;
    artist?: string;
    coverImage?: string;
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'post' | 'manage-posts' | 'music' | 'manage-music' | 'profile'>('post');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { refreshTracks } = useMusic();

    // Post State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [postImage, setPostImage] = useState<File | null>(null);

    // Music State
    const [musicFile, setMusicFile] = useState<File | null>(null);
    const [musicCover, setMusicCover] = useState<File | null>(null);
    const [musicTitle, setMusicTitle] = useState('');
    const [musicArtist, setMusicArtist] = useState('');
    const [uploading, setUploading] = useState(false);

    // Profile State
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [socials, setSocials] = useState({
        qq: '',
        wechat: '',
        telegram: '',
        x: '',
        whatsapp: '',
        github: ''
    });
    const [works, setWorks] = useState<{ title: string; description: string; link: string }[]>([]);
    const [newWork, setNewWork] = useState({ title: '', description: '', link: '' });

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (data.skills) setSkills(data.skills);
                if (data.socials) setSocials(prev => ({ ...prev, ...data.socials }));
                if (data.works) setWorks(data.works);
            });
    }, []);

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleAddWork = () => {
        if (newWork.title && newWork.link) {
            setWorks([...works, newWork]);
            setNewWork({ title: '', description: '', link: '' });
        }
    };

    const removeWork = (index: number) => {
        setWorks(works.filter((_, i) => i !== index));
    };

    const handleProfileSave = async () => {
        // This function is passed to ProfileEditor but logic is mainly handled there via props?
        // Wait, ProfileEditor calls this? No, ProfileEditor has its own submit handler that calls fetch.
        // But we need to pass the data down.
        // Actually, let's look at ProfileEditor again.
        // It takes handleProfileSave prop but doesn't seem to use it in the form submit?
        // The form submit in ProfileEditor calls fetch directly using the props data.
        // So we might not need to pass handleProfileSave if the child handles the fetch.
        // BUT, the child needs to update the parent state? No, the child uses the parent state directly via props.
        // The child's handleProfileUpdate does the fetch.
        // So we just need to make sure the child has all the data.

        // Let's check the ProfileEditor definition in the file.
        // It accepts: handleProfileSave: () => Promise<void>;
        // But in the implementation I wrote earlier, it does:
        // const handleProfileUpdate = async (e) => { ... fetch ... }
        // It doesn't call handleProfileSave prop.

        // So I can just pass a dummy function or remove it from props interface if I could edit that too.
        // For now, let's define it to satisfy the prop requirement if it exists.
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const [editingSlug, setEditingSlug] = useState<string | null>(null);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let coverImageUrl = '';
        if (postImage) {
            const formData = new FormData();
            formData.append('file', postImage);
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            if (uploadRes.ok) {
                const data = await uploadRes.json();
                coverImageUrl = data.url;
            }
        }

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                slug,
                date: new Date().toISOString(),
                excerpt,
                content,
                coverImage: coverImageUrl || undefined // Keep existing if not updated? Logic needs improvement for edit
            }),
        });

        if (res.ok) {
            alert(editingSlug ? '文章已更新！' : '文章已发布！');
            resetForm();
            setActiveTab('manage-posts');
        } else {
            alert('Error saving post');
        }
    };

    const resetForm = () => {
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
        setPostImage(null);
        setEditingSlug(null);
    };

    const handleEdit = (post: PostData) => {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setEditingSlug(post.slug);
        setActiveTab('post');
    };


    const handleMusicUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!musicFile) {
            alert('请选择音频文件');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('audio', musicFile);
            if (musicCover) formData.append('cover', musicCover);
            formData.append('title', musicTitle);
            formData.append('artist', musicArtist);

            const res = await fetch('/api/music', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert('音乐上传成功！');
                setMusicFile(null);
                setMusicCover(null);
                setMusicTitle('');
                setMusicArtist('');
                refreshTracks();
                setActiveTab('manage-music');
            } else {
                alert('上传失败');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('上传出错');
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthenticated) {
        // ... (Login Form)
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <form onSubmit={handleLogin} className="space-y-4 w-full max-w-xs">
                    <h1 className="text-2xl font-bold text-center">管理员登录</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="输入密码"
                        className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-colors"
                    >
                        登录
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">控制台</h1>
                <div className="flex flex-wrap gap-2 bg-secondary p-1 rounded-lg border border-border">
                    <button
                        onClick={() => { setActiveTab('post'); resetForm(); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'post' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {editingSlug ? '编辑文章' : '写文章'}
                    </button>
                    <button
                        onClick={() => setActiveTab('manage-posts')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'manage-posts' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        管理文章
                    </button>
                    {/* ... other tabs */}
                    <button
                        onClick={() => setActiveTab('music')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'music' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        传音乐
                    </button>
                    <button
                        onClick={() => setActiveTab('manage-music')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'manage-music' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        管理音乐
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        个人资料
                    </button>
                </div>
            </header>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'post' ? (
                    <form onSubmit={handlePostSubmit} className="space-y-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">标题</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Slug (URL)</label>
                                <input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                    required
                                    disabled={!!editingSlug} // Disable slug editing to prevent duplicates/confusion
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">封面图片</label>
                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPostImage(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImageIcon size={24} />
                                    <span className="text-sm">{postImage ? postImage.name : "点击上传封面 (保持为空则不修改)"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">摘要</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors h-24 resize-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-muted-foreground">内容 (Markdown)</label>
                                <span className="text-xs text-muted-foreground">支持 Markdown 语法</span>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors h-96 font-mono text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 w-full p-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-colors"
                        >
                            <Save size={20} />
                            {editingSlug ? '更新文章' : '发布文章'}
                        </button>
                    </form>
                ) : activeTab === 'manage-posts' ? (
                    <ManagePosts onEdit={handleEdit} />
                ) : activeTab === 'music' ? (
                    // ... (Music Form)
                    <form onSubmit={handleMusicUpload} className="space-y-6 max-w-xl mx-auto">
                        {/* ... Music Form Content ... */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">歌名</label>
                                <input
                                    value={musicTitle}
                                    onChange={(e) => setMusicTitle(e.target.value)}
                                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                    placeholder="Song Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">歌手</label>
                                <input
                                    value={musicArtist}
                                    onChange={(e) => setMusicArtist(e.target.value)}
                                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                    placeholder="Artist Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">音频文件</label>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 hover:bg-accent/50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <MusicIcon size={32} />
                                        <span className="text-sm">{musicFile ? musicFile.name : "上传 MP3/WAV"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">封面图片</label>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 hover:bg-accent/50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setMusicCover(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ImageIcon size={32} />
                                        <span className="text-sm">{musicCover ? musicCover.name : "上传封面"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!musicFile || uploading}
                            className="w-full p-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? '上传中...' : '确认上传'}
                        </button>
                    </form>
                ) : activeTab === 'manage-music' ? (
                    <ManageMusic />
                ) : (
                    <ProfileEditor
                        skills={skills}
                        setSkills={setSkills}
                        newSkill={newSkill}
                        setNewSkill={setNewSkill}
                        handleAddSkill={handleAddSkill}
                        removeSkill={removeSkill}
                        socials={socials}
                        setSocials={setSocials}
                        works={works}
                        setWorks={setWorks}
                        newWork={newWork}
                        setNewWork={setNewWork}
                        handleAddWork={handleAddWork}
                        removeWork={removeWork}
                        handleProfileSave={handleProfileSave}
                    />
                )}
            </motion.div>
        </div>
    );
}

function ManageMusic() {
    const [tracks, setTracks] = useState<MusicTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const { refreshTracks } = useMusic();

    const fetchTracks = () => {
        fetch('/api/music')
            .then((res) => res.json())
            .then((data) => {
                setTracks(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTracks();
    }, []);

    const handleDelete = async (filename: string) => {
        if (!confirm('确定要删除这首歌吗？')) return;

        const res = await fetch(`/api/music?filename=${filename}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            alert('歌曲已删除');
            fetchTracks();
            refreshTracks();
        } else {
            const error = await res.text();
            alert(`删除失败: ${error}`);
        }
    };

    if (loading) return <div className="text-center text-muted-foreground">加载中...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {tracks.length === 0 ? (
                <div className="text-center text-muted-foreground">暂无音乐</div>
            ) : (
                tracks.map((track) => (
                    <div key={track.filename} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                            {track.coverImage && (
                                <img src={getStaticUrl(track.coverImage)} alt={track.title} className="w-12 h-12 rounded object-cover" />
                            )}
                            <div>
                                <h3 className="font-medium">{track.title || track.filename}</h3>
                                <p className="text-sm text-muted-foreground">{track.artist || 'Unknown Artist'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(track.filename)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                            title="删除"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

function ManagePosts({ onEdit }: { onEdit: (post: PostData) => void }) {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = () => {
        fetch('/api/posts')
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm('确定要删除这篇文章吗？')) return;

        const res = await fetch(`/api/posts?slug=${slug}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            alert('文章已删除');
            fetchPosts();
        } else {
            const error = await res.text();
            alert(`删除失败: ${error}`);
        }
    };

    if (loading) return <div className="text-center text-muted-foreground">加载中...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {posts.length === 0 ? (
                <div className="text-center text-muted-foreground">暂无文章</div>
            ) : (
                posts.map((post) => (
                    <div key={post.slug} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                        <div>
                            <h3 className="font-medium">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString('zh-CN')}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(post)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                title="编辑"
                            >
                                <FileText size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(post.slug)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                title="删除"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function ProfileEditor({
    skills,
    setSkills,
    newSkill,
    setNewSkill,
    handleAddSkill,
    removeSkill,
    socials,
    setSocials,
    works,
    setWorks,
    newWork,
    setNewWork,
    handleAddWork,
    removeWork,
    handleProfileSave,
}: {
    skills: string[];
    setSkills: React.Dispatch<React.SetStateAction<string[]>>;
    newSkill: string;
    setNewSkill: React.Dispatch<React.SetStateAction<string>>;
    handleAddSkill: () => void;
    removeSkill: (skillToRemove: string) => void;
    socials: { qq: string; wechat: string; telegram: string; x: string; whatsapp: string; github: string };
    setSocials: React.Dispatch<React.SetStateAction<{ qq: string; wechat: string; telegram: string; x: string; whatsapp: string; github: string }>>;
    works: { title: string; description: string; link: string; tech?: string[] }[];
    setWorks: React.Dispatch<React.SetStateAction<{ title: string; description: string; link: string; tech?: string[] }[]>>;
    newWork: { title: string; description: string; link: string };
    setNewWork: React.Dispatch<React.SetStateAction<{ title: string; description: string; link: string }>>;
    handleAddWork: () => void;
    removeWork: (index: number) => void;
    handleProfileSave: () => Promise<void>;
}) {
    const [avatar, setAvatar] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // useEffect for fetching data is no longer needed here as data is passed via props
    // But we might need to initialize local state if we were using it, but we are using props now.
    // The parent component fetches the data.

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        // We use the handleProfileSave prop for the main data, but this function
        // seems to handle the avatar upload specifically or the whole form submit?
        // The original handleProfileUpdate handled everything.
        // The parent now has handleProfileSave which sends the JSON data.
        // But the avatar upload needs FormData.

        // Let's look at how we want to handle this.
        // The parent's handleProfileSave sends JSON (skills, socials, works).
        // The original ProfileEditor sent FormData (avatar, skills, socials).

        // If we want to keep the avatar upload working, we should probably
        // combine the logic or let ProfileEditor handle the avatar upload separately?
        // Or better, update the parent's handleProfileSave to handle avatar if possible,
        // OR keep the avatar handling here and call the parent for the rest.

        // However, the simplest fix for the *duplicate identifier* error is just removing the duplicates.
        // But we also need to make sure the logic still works.

        setUploading(true);
        const formData = new FormData();
        if (avatar) formData.append('avatar', avatar);
        formData.append('skills', JSON.stringify(skills));
        formData.append('socials', JSON.stringify(socials));
        formData.append('works', JSON.stringify(works));

        const res = await fetch('/api/profile', {
            method: 'POST',
            body: formData
        });

        setUploading(false);
        if (res.ok) {
            alert('资料更新成功！');
            setAvatar(null);
        } else {
            alert('更新失败');
        }
    };

    return (
        <form onSubmit={handleProfileUpdate} className="space-y-8 max-w-md mx-auto">
            <div className="space-y-4 text-center">
                <label className="text-sm font-medium text-muted-foreground">更换头像</label>
                <div className="border-2 border-dashed border-border rounded-full w-40 h-40 mx-auto flex items-center justify-center hover:bg-accent/50 transition-colors relative overflow-hidden">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {avatar ? (
                        <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImageIcon size={24} />
                            <span className="text-xs">点击上传</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground block text-center">个人标签 / 技能</label>
                <div className="flex gap-2">
                    <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="添加新标签..."
                        className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <button
                        type="button"
                        onClick={handleAddSkill}
                        className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                            <span>{skill}</span>
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground block text-center">社交链接</label>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">QQ</span>
                        <input
                            value={socials.qq}
                            onChange={(e) => setSocials(prev => ({ ...prev, qq: e.target.value }))}
                            placeholder="QQ 链接"
                            className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">WeChat</span>
                        <input
                            value={socials.wechat}
                            onChange={(e) => setSocials(prev => ({ ...prev, wechat: e.target.value }))}
                            placeholder="微信链接"
                            className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">Telegram</span>
                        <input
                            value={socials.telegram}
                            onChange={(e) => setSocials(prev => ({ ...prev, telegram: e.target.value }))}
                            placeholder="Telegram 链接"
                            className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">X (Twitter)</span>
                        <input
                            value={socials.x}
                            onChange={(e) => setSocials(prev => ({ ...prev, x: e.target.value }))}
                            placeholder="X 链接"
                            className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">WhatsApp</span>
                        <input
                            value={socials.whatsapp}
                            onChange={(e) => setSocials(prev => ({ ...prev, whatsapp: e.target.value }))}
                            placeholder="WhatsApp 链接"
                            className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">GitHub</span>
                        <input
                            value={socials.github}
                            onChange={(e) => setSocials(prev => ({ ...prev, github: e.target.value }))}
                            placeholder="GitHub 链接"
                            className="flex-1 p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground block text-center">我的作品</label>
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="标题"
                        value={newWork.title}
                        onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                        className="p-3 rounded bg-white/5 border border-white/10 focus:border-primary outline-none"
                    />
                    <input
                        type="text"
                        placeholder="描述"
                        value={newWork.description}
                        onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                        className="p-3 rounded bg-white/5 border border-white/10 focus:border-primary outline-none"
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="链接"
                            value={newWork.link}
                            onChange={(e) => setNewWork({ ...newWork, link: e.target.value })}
                            className="flex-1 p-3 rounded bg-white/5 border border-white/10 focus:border-primary outline-none"
                        />
                        <button type="button" onClick={handleAddWork} className="p-3 bg-primary text-black rounded hover:bg-primary/80">
                            <Plus />
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    {works.map((work, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/10">
                            <div>
                                <h4 className="font-bold">{work.title}</h4>
                                <p className="text-sm text-gray-400">{work.description}</p>
                                <a href={work.link} target="_blank" className="text-xs text-primary hover:underline">{work.link}</a>
                            </div>
                            <button type="button" onClick={() => removeWork(index)} className="text-red-500 hover:text-red-400">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="w-full p-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? '更新中...' : '保存更改'}
            </button>
        </form>
    );
}
