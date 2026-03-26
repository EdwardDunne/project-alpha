import React, { useEffect, useState } from 'react';

interface Release {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    published_at: string;
    html_url: string;
    prerelease: boolean;
}

const ChangelogPage: React.FC = () => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.github.com/repos/EdwardDunne/project-alpha/releases')
            .then(res => {
                if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
                return res.json();
            })
            .then((data: Release[]) => {
                setReleases(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const renderBody = (body: string) =>
        body.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h3 key={i} className='text-[1.8rem] font-semibold mt-4 mb-1'>{line.slice(3)}</h3>;
            if (line.startsWith('### ')) return <h4 key={i} className='text-[1.6rem] font-semibold mt-3 mb-1'>{line.slice(4)}</h4>;
            if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className='ml-6 list-disc text-[1.5rem] text-gray-700'>{line.slice(2)}</li>;
            if (line.trim() === '') return null;
            return <p key={i} className='text-[1.5rem] text-gray-700'>{line}</p>;
        });

    return (
        <div className='w-full md:max-w-[80rem] mx-auto px-4 py-8'>
            <h1 className='text-[3rem] font-semibold mb-2'>Changelog</h1>
            <p className='text-gray-500 text-[1.5rem] mb-8'>Release history for Omni Trackers</p>

            {loading && (
                <p className='text-gray-500 text-[1.5rem]'>Loading releases...</p>
            )}

            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-600 text-[1.5rem]'>Could not load releases: {error}</p>
                </div>
            )}

            {!loading && !error && releases.length === 0 && (
                <p className='text-gray-500 text-[1.5rem]'>No releases published yet.</p>
            )}

            <div className='flex flex-col gap-6'>
                {releases.map(release => (
                    <div key={release.id} className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                            <div className='flex items-center gap-3 flex-wrap'>
                                <span className='text-[2rem] font-bold'>{release.name || release.tag_name}</span>
                                <span className='bg-brand text-white text-[1.2rem] font-semibold px-2 py-0.5 rounded'>
                                    {release.tag_name}
                                </span>
                                {release.prerelease && (
                                    <span className='bg-yellow-100 text-yellow-800 text-[1.2rem] font-semibold px-2 py-0.5 rounded'>
                                        pre-release
                                    </span>
                                )}
                            </div>
                            <span className='text-gray-400 text-[1.4rem] whitespace-nowrap'>
                                {formatDate(release.published_at)}
                            </span>
                        </div>

                        {release.body ? (
                            <div className='mt-2'>
                                {renderBody(release.body)}
                            </div>
                        ) : (
                            <p className='text-gray-400 text-[1.5rem] italic'>No release notes provided.</p>
                        )}

                        <a
                            href={release.html_url}
                            target='_blank'
                            rel='noreferrer'
                            className='inline-block mt-4 text-brand hover:underline text-[1.4rem]'
                        >
                            View on GitHub →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChangelogPage;
