import { Server, Cpu, Database, Network, ShieldCheck, HardDrive, Terminal, Layers } from 'lucide-react';

export function InfrastructureTab() {
  const specs = [
    {
      title: 'Sistem Operasi (OS) & Virtualisasi',
      icon: <Server className="w-5 h-5 text-[#38bdf8]" />,
      details: [
        { label: 'OS Host', value: 'Linux (Ubuntu 22.04 LTS / Debian 12 Bookworm)' },
        { label: 'Container OS', value: 'Alpine Linux 3.19+ atau Ubuntu Jammy minimal container' },
        { label: 'Container Runtime', value: 'Docker Engine via Pterodactyl Wings Daemon' },
        { label: 'Isolasi', value: 'Linux cgroups v2, namespace security, chroot prison' }
      ]
    },
    {
      title: 'Bahasa Pemrograman & Runtime Engine',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      details: [
        { label: 'Bahasa', value: 'JavaScript (ECMAScript 2024+) / Node.js' },
        { label: 'Runtime Engine', value: 'Node.js 20.x LTS / 22.x Current (Google V8 JIT)' },
        { label: 'Package Manager', value: 'npm v10+ (atau pnpm / yarn)' },
        { label: 'Modul Format', value: 'CommonJS (CJS) & ES Modules (ESM)' }
      ]
    },
    {
      title: 'Jaringan & Protokol Komunikasi',
      icon: <Network className="w-5 h-5 text-[#a855f7]" />,
      details: [
        { label: 'Gateway Discord', value: 'WebSocket Secure (WSS) Gateway v9/v10 (Port 443)' },
        { label: 'Keep-Alive Server', value: 'HTTP 1.1 / Express Framework (Port 3000 / 8080)' },
        { label: 'Encoding', value: 'JSON / ETF (Erlang Term Format) via WebSocket' },
        { label: 'Heartbeat Interval', value: '~41.25 detik (ditentukan oleh Discord Gateway Hello opcode)' }
      ]
    },
    {
      title: 'Alokasi Resource & Kapasitas Hardware',
      icon: <HardDrive className="w-5 h-5 text-amber-400" />,
      details: [
        { label: 'RAM / Memory', value: '256 MB - 512 MB (Penggunaan aktual hanya ~45MB - 80MB)' },
        { label: 'CPU Allocation', value: '0.5 - 1.0 vCPU Core (Load aktual rata-rata <5%)' },
        { label: 'Penyimpanan (Disk)', value: '500 MB - 1 GB NVMe SSD' },
        { label: 'Bandwidth', value: 'Unmetered 1Gbps Uplink' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#38bdf8]" />
          Spesifikasi Arsitektur, Infrastruktur &amp; Sistem Wispbyte (2026)
        </h2>
        <p className="text-sm text-[#94a3b8] mt-1">
          Rincian menyeluruh tentang bagaimana kode dijalankan di atas infrastruktur server Wispbyte, termasuk sistem operasi, containerization, runtime Node.js, dan mekanisme keep-alive 24 jam nonstop.
        </p>
      </div>

      {/* Grid of Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((item, idx) => (
          <div key={idx} className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 hover:border-[#334155] transition-colors">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              {item.icon}
              {item.title}
            </h3>
            <div className="space-y-2.5 text-xs">
              {item.details.map((d, dIdx) => (
                <div key={dIdx} className="flex items-start justify-between gap-3 border-b border-[#1e293b] pb-2 last:border-0 last:pb-0">
                  <span className="text-[#94a3b8] font-mono shrink-0">{d.label}</span>
                  <span className="text-right text-[#cbd5e1] font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Visual Diagram */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-emerald-400" />
          Diagram Alur Uptime 24 Jam Nonstop
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <div className="text-[#38bdf8] font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              1. Host Server (Wispbyte)
            </div>
            <p className="text-[#94a3b8] leading-relaxed">
              Pterodactyl Wings mengisolasi proses dalam Docker container. Container dikonfigurasi dengan flag restart: always dan resource limits yang stabil.
            </p>
          </div>

          <div className="p-4 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              2. Node.js Keep-Alive
            </div>
            <p className="text-[#94a3b8] leading-relaxed">
              Express HTTP Server mendengarkan port 3000 untuk merespons health check. Unhandled rejection shield mencegah Node.js crash akibat transient network failure.
            </p>
          </div>

          <div className="p-4 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <div className="text-[#a855f7] font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
              3. Discord WSS Gateway
            </div>
            <p className="text-[#94a3b8] leading-relaxed">
              WebSocket client mengirim heartbeat teratur dan merotasi status (Online &lt;-&gt; Idle) secara berkala meniru aktivitas manusia asli.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
