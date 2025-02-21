import React from 'react';

export const ChatInput: React.FC<{ onStartBattleClicked(): void; logs: string[] }> = ({
    onStartBattleClicked,
    logs,
}) => {
    return (
        <div className="w-full border-gray-300 rounded p-4">
            <h3 className="text-base font-semibold mb-2">Battle Log</h3>
            <div className="flex items-start gap-2">
                <textarea
                    className="flex-grow h-40 border border-gray-300 rounded p-2 text-sm focus:outline-none"
                    placeholder="Press Start Battle to begin"
                    readOnly
                    value={logs.join('\n')}
                />
                <button onClick={onStartBattleClicked} className="px-3 py-2 bg-indigo-600 text-white rounded shadow">
                    Start Battle!
                </button>
            </div>
        </div>
    );
};
