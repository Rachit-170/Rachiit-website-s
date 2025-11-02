// import React from 'react';
// import { View, Text } from 'react-native';

// function RoomScreen() {
//   return (
//     <View>
//       <Text>Room Screen</Text>
//     </View>
//   );
// }
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Shuffle, Star, StarOff, Crown } from "lucide-react";

// --- helpers: unicode maps for fun styles ---
const smallCapsMap: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ",
  n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

const boldFrakturMap: Record<string, string> = {
  a:"𝖆", b:"𝖇", c:"𝖈", d:"𝖉", e:"𝖊", f:"𝖋", g:"𝖌", h:"𝖍", i:"𝖎", j:"𝖏", k:"𝖐", l:"𝖑", m:"𝖒", n:"𝖓", o:"𝖔", p:"𝖕", q:"𝖖", r:"𝖗", s:"𝖘", t:"𝖙", u:"𝖚", v:"𝖛", w:"𝖜", x:"𝖝", y:"𝖞", z:"𝖟",
  A:"𝕬", B:"𝕭", C:"𝕮", D:"𝕯", E:"𝕰", F:"𝕱", G:"𝕲", H:"𝕳", I:"𝕴", J:"𝕵", K:"𝕶", L:"𝕷", M:"𝕸", N:"𝕹", O:"𝕺", P:"𝕻", Q:"𝕼", R:"𝕽", S:"𝕾", T:"𝕿", U:"𝖀", V:"𝖁", W:"𝖂", X:"𝖃", Y:"𝖄", Z:"𝖅"
};

const monospaceMap: Record<string, string> = {
  a:"𝚊", b:"𝚋", c:"𝚌", d:"𝚍", e:"𝚎", f:"𝚏", g:"𝚐", h:"𝚑", i:"𝚒", j:"𝚓", k:"𝚔", l:"𝚕", m:"𝚖", n:"𝚗", o:"𝚘", p:"𝚙", q:"𝚚", r:"𝚛", s:"𝚜", t:"𝚝", u:"𝚞", v:"𝚟", w:"𝚠", x:"𝚡", y:"𝚢", z:"𝚣",
  A:"𝙰", B:"𝙱", C:"𝙲", D:"𝙳", E:"𝙴", F:"𝙵", G:"𝙶", H:"𝙷", I:"𝙸", J:"𝙹", K:"𝙺", L:"𝙻", M:"𝙼", N:"𝙽", O:"𝙾", P:"𝙿", Q:"𝚀", R:"𝚁", S:"𝚂", T:"𝚃", U:"𝚄", V:"𝚅", W:"𝚆", X:"𝚇", Y:"𝚈", Z:"𝚉"
};

const leet = (s: string) =>
  s.replace(/a/gi, "4")
   .replace(/e/gi, "3")
   .replace(/i/gi, "1")
   .replace(/o/gi, "0")
   .replace(/s/gi, "$")
   .replace(/t/gi, "+");

const mapText = (s: string, map: Record<string,string>) =>
  s.split("").map(ch => map[ch] ?? map[ch.toLowerCase()] ?? ch).join("");

// --- wraps ---
const WRAPS = [
  { id: "none", label: "None", wrap: (s:string) => s },
  { id: "wing", label: "⟪ Wing ⟫", wrap: (s:string) => `⟪ ${s} ⟫` },
  { id: "spark", label: "✦ Spark ✦", wrap: (s:string) => `✦ ${s} ✦` },
  { id: "star", label: "★ Star ★", wrap: (s:string) => `★ ${s} ★` },
  { id: "skull", label: "☠ Skull ☠", wrap: (s:string) => `☠ ${s} ☠` },
];

const DECOS = ["︻デ═一", "ツ", "乡", "彡", "么", "☯", "シ", "★", "✪", "⚡", "♛", "亗", "✿", "➹", "卍", "꧁", "꧂"];

const PRESETS: { id: string; name: string; fn: (s:string)=>string; pro?: boolean }[] = [
  { id: "clean", name: "Clean", fn: (s) => s },
  { id: "smallcaps", name: "Small Caps", fn: (s) => mapText(s, smallCapsMap) },
  { id: "fraktur", name: "Dark Fraktur", fn: (s) => mapText(s, boldFrakturMap) },
  { id: "mono", name: "Monospace", fn: (s) => mapText(s, monospaceMap) },
  { id: "leet", name: "1337", fn: (s) => leet(s) },
  { id: "glow", name: "Glow (PRO)", fn: (s) => s.split("").map(c=> c+"͟").join(""), pro: true },
];

// --- favorites hook ---
function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("ff_favs")||"[]"); } catch { return []; }
  });
  const save = (items: string[]) => { setFavs(items); localStorage.setItem("ff_favs", JSON.stringify(items)); };
  const add = (s: string) => save(Array.from(new Set([s, ...favs])));
  const remove = (s: string) => save(favs.filter(x => x !== s));
  return { favs, add, remove };
}

// --- header ---
const Header = () => (
  <div className="flex items-center justify-between w-full">
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        FF Name Styler <span className="text-muted-foreground">– Pay Custom</span>
      </h1>
      <p className="text-sm md:text-base text-muted-foreground mt-1">
        Create stylish in-game nicknames for battle royale titles. Copy & use anywhere.
      </p>
    </div>
    <Badge className="text-base px-3 py-2 gap-2"><Crown className="w-4 h-4"/> PRO Ready</Badge>
  </div>
);

// --- main app ---
export default function App() {
  const [base, setBase] = useState("Narayan");
  const [wrapId, setWrapId] = useState("none");
  const [decoLeft, setDecoLeft] = useState("彡");
  const [decoRight, setDecoRight] = useState("ツ");
  const [preset, setPreset] = useState("fraktur");
  const [intensity, setIntensity] = useState([50]);
  const [showPro, setShowPro] = useState(false);

  const preview = useMemo(() => {
    const p = PRESETS.find(p=>p.id===preset) ?? PRESETS[0];
    const core = p.fn(base || "Player");
    const wrapped = WRAPS.find(w=>w.id===wrapId)?.wrap(core) ?? core;
    const decoCount = Math.round((intensity[0]/100) * 3);
    const left = new Array(decoCount).fill(decoLeft).join("");
    const right = new Array(decoCount).fill(decoRight).join("");
    return `${left} ${wrapped} ${right}`.replace(/\s+/g, " ").trim();
  }, [base, wrapId, decoLeft, decoRight, preset, intensity]);

  const { favs, add, remove } = useFavorites();

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); alert("Copied!"); } catch { /* noop */ }
  };

  const randomize = () => {
    const rand = (arr:any[]) => arr[Math.floor(Math.random()*arr.length)];
    setWrapId(rand(WRAPS).id);
    setDecoLeft(rand(DECOS));
    setDecoRight(rand(DECOS));
    setPreset(rand(PRESETS).id);
    setIntensity([Math.floor(Math.random()*100)]);
  };

  const handlePreset = (id: string) => {
    const p = PRESETS.find(x=>x.id===id);
    if (p?.pro) { setShowPro(true); return; }
    setPreset(id);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid gap-6">
        <Header />

        <Card className="shadow-xl border-muted-foreground/20">
          <CardHeader className="pb-2">
            <CardTitle>Build your name</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-muted-foreground">Base name</label>
                <Input value={base} onChange={(e)=>setBase(e.target.value)} placeholder="Enter your nickname" />
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-muted-foreground">Style preset</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(p => (
                    <Button key={p.id} variant={preset===p.id?"default":"secondary"} onClick={()=>handlePreset(p.id)} className="rounded-2xl">
                      {p.pro && <Crown className="w-4 h-4 mr-1"/>}{p.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-muted-foreground">Wrap</label>
                <Select value={wrapId} onValueChange={setWrapId}>
                  <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select wrapper"/></SelectTrigger>
                  <SelectContent>
                    {WRAPS.map(w => <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-muted-foreground">Decoration intensity</label>
                <Slider value={intensity} onValueChange={setIntensity} max={100} step={1} className="py-4"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-sm text-muted-foreground">Left deco</label>
                  <Select value={decoLeft} onValueChange={setDecoLeft}>
                    <SelectTrigger className="rounded-2xl"><SelectValue/></SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">
                      {DECOS.map(d => <SelectItem key={`L-${d}`} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-muted-foreground">Right deco</label>
                  <Select value={decoRight} onValueChange={setDecoRight}>
                    <SelectTrigger className="rounded-2xl"><SelectValue/></SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">
                      {DECOS.map(d => <SelectItem key={`R-${d}`} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={randomize} variant="secondary" className="rounded-2xl gap-2"><Shuffle className="w-4 h-4"/> Random</Button>
                <Button onClick={()=>add(preview)} className="rounded-2xl gap-2"><Star className="w-4 h-4"/> Save</Button>
                <Button onClick={()=>copy(preview)} className="rounded-2xl gap-2"><Copy className="w-4 h-4"/> Copy</Button>
              </div>
            </div>

            <div className="md:col-span-1">
              <Card className="bg-background/60 border-dashed">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">Live preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div key={preview} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}} transition={{duration:0.2}} className="select-all p-4 rounded-2xl bg-muted/60 text-center break-words text-xl md:text-2xl">
                      {preview}
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex justify-center mt-3">
                    <Button onClick={()=>copy(preview)} variant="outline" className="rounded-2xl gap-2"><Copy className="w-4 h-4"/> Copy</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Saved names</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {favs.length===0 && <p className="text-muted-foreground">No favorites yet. Save some names and they will appear here.</p>}
                <div className="grid md:grid-cols-2 gap-2">
                  {favs.map(n => (
                    <div key={n} className="flex items-center justify-between rounded-2xl border p-3 bg-background/60">
                      <span className="truncate pr-2">{n}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" className="rounded-2xl" onClick={()=>copy(n)}><Copy className="w-4 h-4"/></Button>
                        <Button size="sm" variant="ghost" className="rounded-2xl" onClick={()=>remove(n)}><StarOff className="w-4 h-4"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About this app</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Fan-made name styler for popular battle royale games. Not affiliated with any game or publisher. Use these nicknames in your player profile, guild, or social bio.</p>
                <div className="flex items-center gap-2"><Crown className="w-4 h-4"/><span>Pro features let you unlock extra styles and export options.</span></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ProDialog open={showPro} onOpenChange={setShowPro} />
      </div>
    </div>
  );
}

// --- pro dialog ---
function ProDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v:boolean)=>void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl"><Crown className="w-5 h-5"/> Go PRO</DialogTitle>
          <DialogDescription>Unlock premium styles,</DialogDescription>