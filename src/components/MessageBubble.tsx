import React from 'react';

export const Badge: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <div className="inline-flex items-center px-2 py-1 text-white text-xs bg-blue-500 rounded-full">{children}</div>
    );
};

interface BubbleContentProps {
    message: string;
    badgeText?: string;
    avatarOnRight: boolean;
}

const BubbleContent: React.FC<BubbleContentProps> = ({ message, badgeText, avatarOnRight }) => {
    return (
        <div className={`flex items-center w-full flex-row justify-between`}>
            <span className={`text-sm leading-snug ${avatarOnRight ? 'text-left' : 'text-right'}`}>{message}</span>
            {badgeText && <Badge>{badgeText}</Badge>}
        </div>
    );
};

interface BubbleBoxProps {
    avatarOnRight: boolean;
    children: React.ReactNode;
}

const BubbleBox: React.FC<BubbleBoxProps> = ({ avatarOnRight, children }) => {
    const baseClasses = 'relative w-full px-4 py-2 rounded-lg';

    const bubbleClasses = avatarOnRight
        ? `${baseClasses} bg-gray-100 text-gray-900
       after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
       after:right-0 after:translate-x-full
       after:border-y-8 after:border-l-8 after:border-y-transparent after:border-l-gray-100`
        : `${baseClasses} bg-indigo-600 text-white
       after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
       after:left-0 after:-translate-x-full
       after:border-y-8 after:border-r-8 after:border-y-transparent after:border-r-indigo-600`;

    return <div className={bubbleClasses}>{children}</div>;
};

interface MessageBubbleProps {
    avatar?: string;
    name?: string;
    message: string;
    timestamp?: string;
    avatarOnRight: boolean;
    badgeText?: string;
}

const Avatar = ({ src }: { src?: string }) => (
    <img src={src || '/fallback.svg'} className="w-50 h-50 rounded-full object-cover" />
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    avatar,
    name,
    message,
    timestamp,
    avatarOnRight,
    badgeText,
}) => {
    return (
        <div className="flex w-full items-start mb-6">
            {avatarOnRight ? (
                <>
                    <div className="flex flex-col flex-1">
                        {name && <h5 className="text-sm font-semibold mb-1 text-left">{name}</h5>}
                        <BubbleBox avatarOnRight={true}>
                            <BubbleContent message={message} badgeText={badgeText} avatarOnRight={true} />
                        </BubbleBox>
                        {timestamp && (
                            <div className="flex justify-start items-center mt-1">
                                <span className="text-xs text-gray-500">{timestamp}</span>
                            </div>
                        )}
                    </div>

                    <div className="ml-4 flex-shrink-0">
                        <Avatar src={avatar} />
                    </div>
                </>
            ) : (
                <>
                    <div className="mr-4 flex-shrink-0">
                        <Avatar src={avatar} />
                    </div>

                    <div className="flex flex-col flex-1">
                        {name && <h5 className="text-sm font-semibold mb-1 text-right">{name}</h5>}
                        <BubbleBox avatarOnRight={false}>
                            <BubbleContent message={message} badgeText={badgeText} avatarOnRight={false} />
                        </BubbleBox>
                        {timestamp && (
                            <div className="flex justify-end items-center mt-1">
                                <span className="text-xs text-gray-500">{timestamp}</span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
