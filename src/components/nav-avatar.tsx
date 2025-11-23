"use client";

import { useEffect, useState } from "react";

interface ProfileData {
    avatar?: string;
}

export function NavAvatar() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isGrayscale, setIsGrayscale] = useState(true);

    useEffect(() => {
        // Check localStorage for avatar state
        const hasClicked = localStorage.getItem('avatar-clicked');
        if (hasClicked === 'true') {
            setIsGrayscale(false);
        }

        fetch('/api/profile')
            .then(res => res.json())
            .then((data: ProfileData) => {
                if (data.avatar) setAvatar(data.avatar);
            })
            .catch(err => console.error("Failed to fetch avatar for nav", err));
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsGrayscale(false);
        localStorage.setItem('avatar-clicked', 'true');
    };

    if (!avatar) return null;

    return (
        <button
            onClick={handleClick}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/50 hover:border-primary transition-all cursor-pointer group bg-transparent p-0"
        >
            <img
                src={avatar}
                alt="User"
                className={`w-full h-full object-cover transition-all duration-500 ${isGrayscale ? 'grayscale hover:grayscale-0' : ''}`}
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
    );
}
