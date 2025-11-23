"use client";

import { MessageCircle, Send, Phone, Github } from 'lucide-react';

interface SocialLink {
    name: string;
    icon: React.ReactNode;
    href: string;
    color: string;
}

interface SocialLinksProps {
    socials?: {
        qq?: string;
        wechat?: string;
        telegram?: string;
        x?: string;
        whatsapp?: string;
        github?: string;
    };
}

export function SocialLinks({ socials }: SocialLinksProps) {
    const links = [
        {
            name: 'QQ',
            icon: <MessageCircle size={20} />,
            href: socials?.qq || '#',
            color: 'hover:text-[#12B7F5]',
            show: !!socials?.qq
        },
        {
            name: 'WeChat',
            icon: <MessageCircle size={20} />,
            href: socials?.wechat || '#',
            color: 'hover:text-[#07C160]',
            show: !!socials?.wechat
        },
        {
            name: 'Telegram',
            icon: <Send size={20} />,
            href: socials?.telegram || '#',
            color: 'hover:text-[#0088cc]',
            show: !!socials?.telegram
        },
        {
            name: 'X',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: socials?.x || '#',
            color: 'hover:text-white',
            show: !!socials?.x
        },
        {
            name: 'WhatsApp',
            icon: <Phone size={20} />,
            href: socials?.whatsapp || '#',
            color: 'hover:text-[#25D366]',
            show: !!socials?.whatsapp
        },
        {
            name: 'GitHub',
            icon: <Github size={20} />,
            href: socials?.github || '#',
            color: 'hover:text-white',
            show: !!socials?.github
        }
    ];

    return (
        <div className="flex items-center gap-4 justify-center">
            {links.filter(link => link.show).map((social) => (
                <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-background/40 backdrop-blur-md border border-white/10 text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-primary/50 ${social.color} group relative`}
                    aria-label={social.name}
                >
                    <div className="relative z-10">{social.icon}</div>
                    <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
            ))}
        </div>
    );
}
