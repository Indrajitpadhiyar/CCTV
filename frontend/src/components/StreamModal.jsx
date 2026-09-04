import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, Terminal, Radio } from 'lucide-react';

export default function StreamModal({ camera, userEmail, userPassword, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!camera) return null;

  const encodedEmail = userEmail ? userEmail.replace('@', '%40') : 'you%40example.com';
  const pwd = userPassword || 'YOUR_PASSWORD';

  const cameraCode = camera.camera_code || camera.id || 'cam01';

  const endpoints = [
    {
      key: 'hls',
      name: 'HLS Stream (Public CDN)',
      protocol: 'HLS',
      intendedFor: 'Dashboards, Mobile & Remote AI',
      url: `https://cctv.corp8.cloud/${cameraCode}/index.m3u8`,
      notes: 'Reachable anywhere over HTTPS'
    },
    {
      key: 'rtsp',
      name: 'RTSP Stream (Direct Public IP - Force TCP)',
      protocol: 'RTSP',
      intendedFor: 'AI Inference (OpenCV, GStreamer, FFmpeg)',
      url: `rtsp://${encodedEmail}:${pwd}@103.250.160.189:8554/stream/${cameraCode}`,
      notes: 'Requires rtsp_transport=tcp option'
    },
    {
      key: 'whep',
      name: 'WebRTC WHEP (Direct Public IP)',
      protocol: 'WHEP',
      intendedFor: 'Low-latency Browser Preview',
      url: `http://${encodedEmail}:${pwd}@103.250.160.189:8889/stream/${cameraCode}/whep`,
      notes: 'Ultra low-latency HTTP WHEP endpoint'
    }
  ];

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                Camera Stream Endpoints
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                  {cameraCode.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Centralized live stream URLs & credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Percent Encoding Notice */}
        <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          <div>
            <span className="font-semibold">URL Email Encoding Applied: </span>
            Your email <code className="bg-black/40 px-1 py-0.5 rounded font-mono text-emerald-200">{userEmail || 'you@example.com'}</code> is percent-encoded as <code className="bg-black/40 px-1 py-0.5 rounded font-mono text-emerald-200">{encodedEmail}</code> for RTSP & WHEP URLs.
          </div>
        </div>

        {/* Stream Endpoint List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {endpoints.map((ep) => (
            <div
              key={ep.key}
              className="p-4 rounded-lg bg-gray-950/70 border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-200">{ep.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {ep.protocol}
                  </span>
                </div>
                <span className="text-xs text-gray-400 italic">{ep.intendedFor}</span>
              </div>

              <div className="relative flex items-center mt-2">
                <input
                  type="text"
                  readOnly
                  value={ep.url}
                  className="w-full px-3 py-2 pr-10 text-xs font-mono bg-black/60 border border-gray-800 rounded text-cyan-300 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(ep.key, ep.url)}
                  className="absolute right-2 p-1 text-gray-400 hover:text-white transition"
                  title="Copy Stream URL"
                >
                  {copiedKey === ep.key ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500 font-mono">
                ℹ️ {ep.notes}
              </p>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>OpenCV FFMPEG Option: <code className="text-cyan-300 font-mono">rtsp_transport;tcp</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
