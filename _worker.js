// _worker.js – শুধু HTTP Canary-সদৃশ টুল ব্লক, বাকি সব প্লেয়ার/ব্রাউজার চলবে

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const userAgent = request.headers.get('User-Agent') || '';

    // 🛡️ শুধুমাত্র HTTP Canary ও তার মতো টুল ব্লক (খুব সংকীর্ণ তালিকা)
    const BLOCKED_AGENTS = [
      'httpcanary', // HTTP Canary অ্যাপ
      'okhttp',     // OkHttp লাইব্রেরি (অনেক স্নিফার ব্যবহার করে)
    ];

    // চেক: ব্লক তালিকায় আছে কিনা (কেস ইনসেনসিটিভ)
    const isBlocked = BLOCKED_AGENTS.some(agent => userAgent.toLowerCase().includes(agent.toLowerCase()));
    if (isBlocked) {
      return new Response('🚫 Access Denied: HTTP Canary or similar tool detected.', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // ============================================================
    // 📌 চ্যানেল কনফিগারেশন (ডিফল্ট ৬টি)
    // ============================================================
    const CHANNELS = {
      'sunnext-sunnews': {
        url: 'https://livestream3.sunnxt.com/491c99fb6d0c49e88e6349170d890a2f/SunNewsB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-ktv': {
        url: 'https://livestream.sunnxt.com/6ae70edd4c1440379f5311e8fbddc7c1/KTVB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-ktvhd': {
        url: 'https://livestream.sunnxt.com/61477b4c8d8d45d5a49e044cc1dffc60/KTVHDB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-suryatvhd': {
        url: 'https://livestream15.sunnxt.com/d719fad367614ee5baad747822767ad8/SuryaTVHDB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-suryatv': {
        url: 'https://livestream6.sunnxt.com/30612a1b269d4a18aa14657641c47515/SuryaTVB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-suryamovies': {
        url: 'https://livestream.sunnxt.com/e24ee14c395945bd8ccb065e1bce8b9b/SuryaMoviesB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-suryamusic': {
        url: 'https://livestream.sunnxt.com/8c2352ff54954e7b9a4188045dcf3b27/SuryaMusicB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-suryacomedy': {
        url: 'https://livestream.sunnxt.com/6505e922bf164423ad122f404747356a/SuryaComedyB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-udayatvhd': {
        url: 'https://livestream16.sunnxt.com/a8d28f18944c4946ad7133938860e7cf/UdayaTVHDB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-udayatv': {
        url: 'https://livestream5.sunnxt.com/e2f36b5d0be74780a041a8f5b65bc7e6/UdayaTVB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-udayamovies': {
        url: 'https://livestream.sunnxt.com/1c02547243c041eea5dab1c343018e90/UdayaMoviesB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-udaymusic': {
        url: 'https://livestream.sunnxt.com/8034b7519d6a4ab8929aa4279fda1f29/UdayaMusicB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-udayacomedy': {
        url: 'https://livestream.sunnxt.com/8a3d3d8d679b4f9f83a8305b4ead0644/UdayaComedyB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-geminitv': {
        url: 'https://livestream4.sunnxt.com/a1a61fa1811c4d20a5c2d5e14cdc0cd2/GeminiTVB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-geminitvhd': {
        url: 'https://livestream14.sunnxt.com/e778d9c98488494b9c9b38f9c48b63ec/GeminiTVHDB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-geminimovieshd': {
        url: 'https://livestream.sunnxt.com/ec0d4961a002442295f91efc9d675c9d/GeminiMoviesHDB_IN_index.mpd',
        type: 'redirect'
      },
      'sunnext-geminimovies': {
        url: 'https://livestream.sunnxt.com/6a59979ff0044fd3b6e0cb85d6f44432/GeminiMoviesB_IN_index.mpd',
        type: 'redirect'
      },
      'zee_bangla': {
        url: 'https://bldcmprod-cdn.toffeelive.com/cdn/live/slang/zee_bangla_576/zee_bangla_576.m3u8?bitrate=500000&channel=zee_bangla_576&gp_id=',
        type: 'proxy'
      },
      'b4u_music': {
        url: 'https://bldcmprod-cdn.toffeelive.com/cdn/live/b4u_music/playlist.m3u8',
        type: 'proxy'
      },
      'zee_bangla_cinema': {
        url: 'https://bldcmprod-cdn.toffeelive.com/cdn/live/zee_bangla_cinema/playlist.m3u8',
        type: 'proxy'
      },
      'andpicture_hd': {
        url: 'https://bldcmprod-cdn.toffeelive.com/cdn/live/andpicture_hd/playlist.m3u8',
        type: 'proxy'
      },
      'mtv': {
        url: 'https://bldcmprod-cdn.toffeelive.com/cdn/live/slang/mtv_576/mtv_576.m3u8?bitrate=500000&channel=mtv_576&gp_id=',
        type: 'proxy'
      },
      'sony_aath': {
        url: 'https%3A%2F%2Fbldcmprod-cdn.toffeelive.com%2Fcdn%2Flive%2Fslang%2Fsonyaath_576%2Fsonyaath_576.m3u8%3Fbitrate%3D1000000%26channel%3Dsonyaath_576%26gp_id%3D',
        type: 'proxy'
      },
      'sony_sab': {
        url: 'https://bldcmprod-cdn.toffeelive.com/cdn/live/slang/sony_sab_576/sony_sab_576.m3u8?bitrate=500000&channel=sony_sab_576&gp_id=',
        type: 'proxy'
      }
      // 👇 এখানে নতুন চ্যানেল যোগ করুন (শেষ আইটেমের পরে কমা দেবেন না)
    };

    const match = path.match(/^\/(.+)\.m3u8$/);

    if (match) {
      const channelName = match[1];
      const config = CHANNELS[channelName];

      if (!config) {
        const available = Object.keys(CHANNELS).join(', ');
        return new Response(`Channel "${channelName}" not found. Available: ${available}`, { status: 404 });
      }

      // ---------- রিডাইরেক্ট ----------
      if (config.type === 'redirect') {
        return Response.redirect(config.url, 307);
      }

      // ---------- প্রক্সি ----------
      if (config.type === 'proxy') {
        const proxyUrl = `https://s2.itcnbd.live/server-2/proxy/${channelName}/playlist?u=${encodeURIComponent(config.url)}`;

        try {
          const response = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'VLC/3.0.18',
              'Referer': 'https://www.toffeelive.com/'
            }
          });

          if (!response.ok) {
            return new Response(`Proxy fetch failed: ${response.status}`, { status: response.status });
          }

          let content = await response.text();

          // সেগমেন্ট রিরাইট (পূর্ণাঙ্গ লিংক বানান)
          const base = new URL(config.url);
          const basePath = base.pathname.substring(0, base.pathname.lastIndexOf('/') + 1);
          const lines = content.split('\n');
          const newLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed === '' || trimmed.startsWith('#') || trimmed.match(/^https?:\/\//)) return line;
            if (trimmed.startsWith('/')) return base.origin + trimmed;
            return base.origin + basePath + trimmed;
          });
          content = newLines.join('\n');

          return new Response(content, {
            status: 200,
            headers: {
              'Content-Type': 'application/vnd.apple.mpegurl',
              'Cache-Control': 'public, max-age=2, stale-while-revalidate=30',
              'Access-Control-Allow-Origin': '*'
            }
          });

        } catch (error) {
          return new Response('Proxy Error: ' + error.message, { status: 500 });
        }
      }
    }

    // হোম পেজ – সব ব্রাউজারে খোলা থাকবে
    const list = Object.keys(CHANNELS).map(ch => `/${ch}.m3u8 (${CHANNELS[ch].type})`).join('\n');
    return new Response(`✅ Secure Proxy Active.\n\nAvailable Channels:\n${list}\n\n📌 Works in browsers, VLC, MX Player, OttNavigator, and all IPTV players. HTTP Canary blocked.`, { status: 200 });
  }
};
