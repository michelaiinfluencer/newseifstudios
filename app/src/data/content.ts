/* Seif Studios content bible, ported from the user's BUILD-BRIEF.
   All visible copy is dash-free by design. */

export type WorkPiece = {
  src: string;
  ratio: string;
  kind: "image" | "video";
  title: string;
  caption: string;
  tag: "Still" | "9:16" | "16:9";
  poster?: string;
};

export type WorkChapter = {
  id: string;
  title: string;
  sub: string;
  pieces: WorkPiece[];
};

const A = "/assets";

export const MARQUEE_ITEMS = [
  "AI Image Generation",
  "AI Video Production",
  "Brand Visuals",
  "Creative Direction",
  "Motion Design",
  "Art Direction",
  "Concept Art",
  "Product Renders",
];

export const WORK_CHAPTERS: WorkChapter[] = [
  {
    id: "images",
    title: "AI Image Generation",
    sub: "Hyper real product imagery to cinematic fashion editorials: visuals that feel intentional, not artificial.",
    pieces: [
      { src: `${A}/Image/Images/PortfolioImageImage2.jpg`, ratio: "3392/5056", kind: "image", title: "First Light", caption: "Studio grade editorial portrait", tag: "Still" },
      { src: `${A}/Image/Images/PortfolioImageImage1.jpg`, ratio: "3072/5504", kind: "image", title: "Chromatic Still", caption: "Color forward brand image", tag: "Still" },
      { src: `${A}/Image/Images/PortfolioImageImage3.jpg`, ratio: "3584/4800", kind: "image", title: "Atelier", caption: "Fashion editorial concept", tag: "Still" },
      { src: `${A}/Image/Images/PortfolioImageImage4.jpg`, ratio: "3584/4800", kind: "image", title: "Nocturne", caption: "Low key cinematic scene", tag: "Still" },
      { src: `${A}/Image/Images/PortfolioImageImage5.jpg`, ratio: "3584/4800", kind: "image", title: "Silhouette Study", caption: "Form and light", tag: "Still" },
      { src: `${A}/Image/Images/PortfolioImageImage6.jpg`, ratio: "3072/5504", kind: "image", title: "Grain and Glass", caption: "Textured product still", tag: "Still" },
    ],
  },
  {
    id: "video",
    title: "AI Video and Animation",
    sub: "Short and long format AI video. Motion that feels cinematic and brand aligned, from social 9:16 to widescreen 16:9.",
    pieces: [
      { src: `${A}/Video/Videos/PortfoliVideoVideo1.mp4`, ratio: "800/1434", poster: `${A}/Video/Videos/PortfoliVideoVideo1.jpg`, kind: "video", title: "Pulse", caption: "Social first motion", tag: "9:16" },
      { src: `${A}/Video/Videos/PortfoliVideoVideo2.mp4`, ratio: "800/1002", poster: `${A}/Video/Videos/PortfoliVideoVideo2.jpg`, kind: "video", title: "Bloom", caption: "Creative motion study", tag: "9:16" },
      { src: `${A}/Video/Videos/PortfoliVideoVideo3.mp4`, ratio: "800/1420", poster: `${A}/Video/Videos/PortfoliVideoVideo3.jpg`, kind: "video", title: "Signal", caption: "Brand essence loop", tag: "9:16" },
      { src: `${A}/Video/Videos/PortfoliVideoVideo4.mp4`, ratio: "800/338", poster: `${A}/Video/Videos/PortfoliVideoVideo4.jpg`, kind: "video", title: "Wide Open", caption: "Cinematic art film", tag: "16:9" },
      { src: `${A}/Video/Videos/PortfoliVideoVideo5.mp4`, ratio: "800/338", poster: `${A}/Video/Videos/PortfoliVideoVideo5.jpg`, kind: "video", title: "Momentum", caption: "Brand motion", tag: "16:9" },
      { src: `${A}/Video/Videos/PortfoliVideoVideo6.mp4`, ratio: "800/338", poster: `${A}/Video/Videos/PortfoliVideoVideo6.jpg`, kind: "video", title: "Afterimage", caption: "Digital echo", tag: "16:9" },
    ],
  },
  {
    id: "models",
    title: "Custom AI Models",
    sub: "Private models fine tuned to your brand: a consistent digital face, a virtual ambassador, an aesthetic system that belongs to you.",
    pieces: [
      { src: `${A}/Image/Models/PortfolioModelImage1.jpg`, ratio: "2048/2730", kind: "image", title: "Muse", caption: "Trained brand face", tag: "Still" },
      { src: `${A}/Image/Models/PortfolioModelImage2.jpg`, ratio: "2048/2730", kind: "image", title: "Cipher", caption: "Consistent identity", tag: "Still" },
      { src: `${A}/Image/Models/PortfolioModelImage3.jpg`, ratio: "2048/2730", kind: "image", title: "Icon", caption: "Signature look", tag: "Still" },
      { src: `${A}/Image/Models/PortfolioModelImage4.jpg`, ratio: "2048/2730", kind: "image", title: "Double", caption: "Virtual ambassador", tag: "Still" },
      { src: `${A}/Image/Models/PortfolioModelImage5.jpg`, ratio: "2048/2730", kind: "image", title: "Continuum", caption: "Controlled aesthetic system", tag: "Still" },
      { src: `${A}/Image/Models/PortfolioModelImage6.jpg`, ratio: "2048/2730", kind: "image", title: "Likeness", caption: "Owned model output", tag: "Still" },
    ],
  },
  {
    id: "product",
    title: "Product Placement",
    sub: "Your product at the center of high conversion AI environments: studio, lifestyle, luxury, street.",
    pieces: [
      { src: `${A}/Image/Products/PortfolioProductImage7.jpg`, ratio: "768/1376", kind: "image", title: "Hero Shot", caption: "Studio product feature", tag: "Still" },
      { src: `${A}/Image/Products/PortfolioProductImage8.jpg`, ratio: "2806/4988", kind: "image", title: "On Location", caption: "Lifestyle placement", tag: "Still" },
      { src: `${A}/Image/Products/PortfolioProductImage4.jpg`, ratio: "3328/4992", kind: "image", title: "Center Stage", caption: "Campaign ready render", tag: "Still" },
    ],
  },
  {
    id: "lookbooks",
    title: "Lookbooks and Campaigns",
    sub: "Complete visual storytelling systems: full lookbooks, seasonal campaigns, launch visuals, multi platform content.",
    pieces: [
      { src: `${A}/Image/Lookbooks/PortfolioLookbookImage3.jpg`, ratio: "3072/5504", kind: "image", title: "Season One", caption: "Lookbook key visual", tag: "Still" },
      { src: `${A}/Image/Lookbooks/PortfolioLookbookImage5.jpg`, ratio: "3712/4608", kind: "image", title: "Capsule", caption: "Campaign still", tag: "Still" },
      { src: `${A}/Image/Lookbooks/PortfolioLookbookImage1.jpg`, ratio: "3392/5056", kind: "image", title: "Campaign Key", caption: "Launch visual", tag: "Still" },
      { src: `${A}/Video/Lookbooks/PortfolioLookbookVideo1.mp4`, ratio: "800/1422", poster: `${A}/Video/Lookbooks/PortfolioLookbookVideo1.jpg`, kind: "video", title: "Lookbook Reel", caption: "Seasonal motion", tag: "9:16" },
      { src: `${A}/Video/Lookbooks/PortfolioLookbookVideo4.mp4`, ratio: "800/1070", poster: `${A}/Video/Lookbooks/PortfolioLookbookVideo4.jpg`, kind: "video", title: "The Drop", caption: "Launch teaser", tag: "9:16" },
      { src: `${A}/Video/Lookbooks/PortfolioLookbookVideo3.mp4`, ratio: "800/1422", poster: `${A}/Video/Lookbooks/PortfolioLookbookVideo3.jpg`, kind: "video", title: "Editorial Motion", caption: "Campaign cutdown", tag: "9:16" },
    ],
  },
  {
    id: "avatars",
    title: "AI Avatar",
    sub: "Realistic, stylized, or futuristic avatars that carry your brand personality across social, marketing, and virtual experiences.",
    pieces: [
      { src: `${A}/Image/Avatars/PortfolioAvatarImage1.jpg`, ratio: "3584/4800", kind: "image", title: "Neon Self", caption: "Stylized digital identity", tag: "Still" },
      { src: `${A}/Image/Avatars/PortfolioAvatarImage2.jpg`, ratio: "3584/4800", kind: "image", title: "Digital Twin", caption: "Realistic avatar", tag: "Still" },
      { src: `${A}/Image/Avatars/PortfolioAvatarImage3.jpg`, ratio: "3072/5504", kind: "image", title: "Alter", caption: "Brand persona", tag: "Still" },
      { src: `${A}/Image/Avatars/PortfolioAvatarImage4.jpg`, ratio: "3584/4800", kind: "image", title: "Hologram", caption: "Futuristic identity", tag: "Still" },
      { src: `${A}/Image/Avatars/PortfolioAvatarImage5.jpg`, ratio: "3392/5056", kind: "image", title: "Synthetic", caption: "Virtual ambassador", tag: "Still" },
      { src: `${A}/Image/Avatars/PortfolioAvatarImage6.jpg`, ratio: "1725/2310", kind: "image", title: "Second Skin", caption: "Digital influencer", tag: "Still" },
    ],
  },
  {
    id: "ugc",
    title: "UGC",
    sub: "AI generated user content that feels native to TikTok and Instagram: realistic, engaging, built to convert.",
    pieces: [
      { src: `${A}/Image/UGC/ImageUGC1.jpg`, ratio: "1650/2048", kind: "image", title: "Unboxed", caption: "Native product moment", tag: "Still" },
      { src: `${A}/Image/UGC/ImageUGC3.jpg`, ratio: "1091/1441", kind: "image", title: "In Hand", caption: "Authentic use shot", tag: "Still" },
      { src: `${A}/Image/UGC/ImageUGC2.jpg`, ratio: "941/1672", kind: "image", title: "Real Talk", caption: "Creator style content", tag: "Still" },
    ],
  },
];

export type Service = {
  num: string;
  title: string;
  desc: string;
  pills: string[];
  media: string;
  mediaKind: "image" | "video";
  poster?: string;
  chapterId: string;
};

export const SERVICES: Service[] = [
  {
    num: "01",
    title: "AI Image Generation",
    desc: "Ultra realistic imagery, natural people, immersive environments. Studio quality without traditional production.",
    pills: ["Midjourney", "Nano Banana", "Seedream"],
    media: `${A}/Image/Solutions/SolutionImage1.jpg`,
    mediaKind: "image",
    chapterId: "images",
  },
  {
    num: "02",
    title: "AI Video and Animation",
    desc: "Cinematic AI video with lifelike motion that brings brands, products, and stories to life.",
    pills: ["Veo", "Seedance", "Kling"],
    media: `${A}/Video/Main/morfing1.mp4`,
    poster: `${A}/Video/Main/morfing1.jpg`,
    mediaKind: "video",
    chapterId: "video",
  },
  {
    num: "03",
    title: "Product Placement",
    desc: "High impact product imagery: realistic renders, styled environments, campaign ready visuals.",
    pills: ["Branding", "Style Guides"],
    media: `${A}/Video/Solutions/Solution+PortfolioProductVideo1.mp4`,
    poster: `${A}/Video/Solutions/Solution+PortfolioProductVideo1.jpg`,
    mediaKind: "video",
    chapterId: "product",
  },
  {
    num: "04",
    title: "Lookbook and Campaign",
    desc: "Striking images and short form video built to elevate social presence and digital campaigns.",
    pills: ["Instagram", "TikTok", "YouTube"],
    media: `${A}/Image/Solutions/SolutionLookbokImage2.jpg`,
    mediaKind: "image",
    chapterId: "lookbooks",
  },
  {
    num: "05",
    title: "Custom AI Models",
    desc: "Custom trained systems that capture your visual identity, products, and style with consistency.",
    pills: ["Nano Banana Pro", "Seedream", "Character"],
    media: `${A}/Image/Solutions/SolutionModelImage5.jpg`,
    mediaKind: "image",
    chapterId: "models",
  },
  {
    num: "06",
    title: "AI Avatar",
    desc: "Realistic, stylized, or futuristic avatars for brands, influencers, and digital identities.",
    pills: ["Higgsfield", "HeyGen", "Soul"],
    media: `${A}/Image/Solutions/Solution+PortfolioAvatar4.jpg`,
    mediaKind: "image",
    chapterId: "avatars",
  },
  {
    num: "07",
    title: "UGC",
    desc: "User generated content that builds trust and converts, native to TikTok and Instagram.",
    pills: ["TikTok", "Instagram", "Reels"],
    media: `${A}/Video/Solutions/SolutionVideoUGC1.mp4`,
    poster: `${A}/Video/Solutions/SolutionVideoUGC1.jpg`,
    mediaKind: "video",
    chapterId: "ugc",
  },
];

export const PROCESS_STEPS = [
  {
    num: "01",
    tag: "Discovery",
    title: "Brief and Creative Direction",
    desc: "Every project starts with understanding your brand, goals, and visual direction. You complete a short creative brief and we align on aesthetic, audience, and scope.",
    pills: ["Creative Brief", "Brand Audit", "Moodboarding", "Goal Setting"],
  },
  {
    num: "02",
    tag: "Concepting",
    title: "AI Assisted Concept Development",
    desc: "Using insights from the brief, we develop visual directions with advanced AI tools. We generate multiple concepts, select the strongest ideas, and refine them into clear creative directions.",
    pills: ["Midjourney", "Stable Diffusion", "Flux", "Kling", "Runway"],
  },
  {
    num: "03",
    tag: "Refinement",
    title: "Feedback, Iteration, and Polish",
    desc: "You review the concepts and share feedback. We refine composition, lighting, and color to a polished cinematic result. Every visual passes manual quality control and post production.",
    pills: ["Up to 3 Revision Rounds", "Photoshop Retouching", "Color Grading", "Upscaling"],
  },
  {
    num: "04",
    tag: "Delivery",
    title: "Final Files and Handoff",
    desc: "Once approved, we deliver final assets in the formats you need: high resolution images, optimized exports, and video files, all through a clean shared drive.",
    pills: ["Hi Res PNG / JPG", "MP4 / MOV", "Web Optimized", "Style Reference"],
  },
];

export const AI_STACK = [
  { cat: "Image Generation", name: "Nano Banana / Midjourney", desc: "Industry leading aesthetic quality for concept art, editorial, and brand imagery." },
  { cat: "Video Generation", name: "Seedance / Kling / Veo", desc: "Cinematic AI video generation with precise motion and scene control." },
  { cat: "Post Processing", name: "Adobe Photoshop", desc: "Professional retouching, compositing, and color grading for every deliverable." },
  { cat: "Upscaling", name: "Topaz AI", desc: "AI powered upscaling that delivers pristine, print ready resolution from any source." },
  { cat: "Workflow", name: "ComfyUI", desc: "Custom node based pipelines for automated, repeatable, brand specific workflows." },
];

export const TIMELINE = [
  { day: "Day 1", title: "Intake and Brief Call", desc: "We review your creative brief and schedule a short discovery call to align on goals, tone, and deliverables." },
  { day: "Day 2 to 3", title: "Concept Development", desc: "We generate, curate, and refine multiple creative directions. You receive a visual concept board with distinct options." },
  { day: "Day 3 to 4", title: "Client Review and Feedback", desc: "You review the concepts and give structured feedback. We confirm the creative direction to move forward with." },
  { day: "Day 4 to 6", title: "Refinement and Post Processing", desc: "We iterate on your selected direction: retouching, grading, and polishing every piece to a professional standard." },
  { day: "Day 7", title: "Final Delivery", desc: "All approved files are packaged and delivered via shared drive, with usage guide and style references as applicable." },
];

export const CONTACT = {
  email: "mail@seifstudios.com",
  instagram: "https://instagram.com/seif.studios",
  location: "Based in Europe, Working Worldwide.",
};
