/* global process */
import fs from 'fs';
import path from 'path';

const API_BASE = process.env.API_BASE || 'http://localhost:8000/admin/';
const IMAGES_DIR = path.join(process.cwd(), 'public', 'powder-images');

function getFileBlob(filepath, filename) {
  const buffer = fs.readFileSync(filepath);
  return new Blob([buffer], { type: filename.endsWith('.png') ? 'image/png' : 'image/jpeg' });
}

// Available images map
const IMAGES = {
  anti_moisture_bag: path.join(IMAGES_DIR, 'jgb-anti-moisture-bag-25kg.jpg'),
  calcium_powder_bag: path.join(IMAGES_DIR, 'jgb-calcium-powder-bag-25kg.jpg'),
  pure_powder_pile: path.join(IMAGES_DIR, 'pure-powder-mound.jpg'),
  hero_factory: path.join(IMAGES_DIR, 'jgb-factory-warehouse-slider.jpg'),
  hero_moisture: path.join(IMAGES_DIR, 'jgb-anti-moisture-tech-slider.jpg'),
  hero_calcium: path.join(IMAGES_DIR, 'jgb-calcium-minerals-slider.jpg'),
  talc_bag: path.join(IMAGES_DIR, 'jgb-talc-soapstone-powder-bag.jpg'),
  dolomite_bag: path.join(IMAGES_DIR, 'jgb-dolomite-powder-bag.jpg'),
  masterbatch_bag: path.join(IMAGES_DIR, 'jgb-masterbatch-additive-bag.jpg'),
  coated_calcium_bag: path.join(IMAGES_DIR, 'jgb-coated-calcium-2500mesh-bag.jpg'),
  quality_lab: path.join(IMAGES_DIR, 'jgb-quality-lab-testing.jpg'),
  logistics: path.join(IMAGES_DIR, 'jgb-logistics-shipping.jpg'),
  pcc_bag: path.join(IMAGES_DIR, 'jgb-precipitated-calcium-pcc-bag.jpg'),
  user_anti_moisture: path.join(IMAGES_DIR, 'jgb-anti-moisture-powder-original.png'),
  user_powder_pile: path.join(IMAGES_DIR, 'pure-white-powder-pile-original.png'),
  user_calcium: path.join(IMAGES_DIR, 'jgb-calcium-powder-original.png'),
};

async function wipeAll() {
  console.log('>>> [STEP 1] Purging old records...');
  const modules = [
    { view: 'product/view', del: 'product/multidelete' },
    { view: 'subsubcategory/view', del: 'subsubcategory/multidelete' },
    { view: 'subcategory/view', del: 'subcategory/multidelete' },
    { view: 'category/view', del: 'category/multidelete' },
    { view: 'color/view', del: 'color/multidelete' },
    { view: 'material/view', del: 'material/multidelete' },
    { view: 'slider/view', del: 'slider/multidelete' },
    { view: 'country/view', del: 'country/multidelete' },
    { view: 'faq/view', del: 'faq/multidelete' },
    { view: 'whychooseus/view', del: 'whychooseus/multidelete' },
  ];

  for (const m of modules) {
    try {
      const res = await fetch(API_BASE + m.view);
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const ids = json.data.map(item => item._id);
        await fetch(API_BASE + m.del, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
      }
    } catch (err) {
      console.error(`Error deleting ${m.view}:`, err.message);
    }
  }
}

async function seedColors() {
  console.log('>>> [STEP 2] Seeding Colors...');
  const colors = [
    { name: 'Snow White', code: '#FFFFFF', order: 1 },
    { name: 'Bright White', code: '#F8F9FA', order: 2 },
    { name: 'Off White', code: '#F0EFEA', order: 3 },
    { name: 'Cream White', code: '#FDFBF7', order: 4 },
    { name: 'Grey White', code: '#E9ECEF', order: 5 },
    { name: 'Pure White', code: '#F5F5F5', order: 6 },
  ];

  const colorMap = {};
  for (const c of colors) {
    await fetch(API_BASE + 'color/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    });
  }

  const res = await fetch(API_BASE + 'color/view');
  const json = await res.json();
  if (json.data) {
    json.data.forEach(item => {
      colorMap[item.name] = item._id;
    });
  }
  return colorMap;
}

async function seedMaterials() {
  console.log('>>> [STEP 3] Seeding Materials...');
  const materials = [
    { name: 'CaCO3 Powder', order: 1 },
    { name: 'Anti-Moisture', order: 2 },
    { name: 'Talc Mineral', order: 3 },
    { name: 'Dolomite Min', order: 4 },
    { name: 'Nano PCC', order: 5 },
    { name: 'Masterbatch', order: 6 },
  ];

  const matMap = {};
  for (const m of materials) {
    await fetch(API_BASE + 'material/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(m),
    });
  }

  const res = await fetch(API_BASE + 'material/view');
  const json = await res.json();
  if (json.data) {
    json.data.forEach(item => {
      matMap[item.name] = item._id;
    });
  }
  return matMap;
}

async function seedCountries() {
  console.log('>>> [STEP 4] Seeding Countries...');
  const countries = [
    { name: 'India', order: 1 },
    { name: 'United Arab Emirates', order: 2 },
    { name: 'Saudi Arabia', order: 3 },
    { name: 'Vietnam', order: 4 },
    { name: 'United States', order: 5 },
    { name: 'Germany', order: 6 },
    { name: 'Bangladesh', order: 7 },
    { name: 'United Kingdom', order: 8 },
    { name: 'South Africa', order: 9 },
  ];

  for (const c of countries) {
    await fetch(API_BASE + 'country/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    });
  }
}

async function seedCategories() {
  console.log('>>> [STEP 5] Seeding 3 Parent Categories...');
  const cats = [
    { name: 'Anti-Moisture Powders', slug: 'anti-moisture-powders', order: 1, img: IMAGES.anti_moisture_bag },
    { name: 'Calcium & Mineral Powders', slug: 'calcium-and-mineral-powders', order: 2, img: IMAGES.calcium_powder_bag },
    { name: 'Polymer & Plastic Additives', slug: 'polymer-and-plastic-additives', order: 3, img: IMAGES.masterbatch_bag },
  ];

  const catMap = {};
  for (const cat of cats) {
    const fd = new FormData();
    fd.append('name', cat.name);
    fd.append('slug', cat.slug);
    fd.append('order', String(cat.order));
    const filename = path.basename(cat.img);
    fd.append('image', getFileBlob(cat.img, filename), filename);

    await fetch(API_BASE + 'category/create', { method: 'POST', body: fd });
  }

  const res = await fetch(API_BASE + 'category/view');
  const json = await res.json();
  if (json.data) {
    json.data.forEach(item => {
      catMap[item.name] = item._id;
    });
  }
  return catMap;
}

async function seedSubCategories(catMap) {
  console.log('>>> [STEP 6] Seeding 8 Sub Categories...');
  const subCats = [
    {
      parentCategory: catMap['Anti-Moisture Powders'],
      name: 'Plastic Extrusion Desiccant Powder',
      slug: 'plastic-extrusion-desiccant-powder',
      order: 1,
      img: IMAGES.user_anti_moisture,
    },
    {
      parentCategory: catMap['Anti-Moisture Powders'],
      name: 'Blow Moulding Anti-Moisture Grade',
      slug: 'blow-moulding-anti-moisture-grade',
      order: 2,
      img: IMAGES.anti_moisture_bag,
    },
    {
      parentCategory: catMap['Anti-Moisture Powders'],
      name: 'Recycled Polymer Moisture Scavenger',
      slug: 'recycled-polymer-moisture-scavenger',
      order: 3,
      img: IMAGES.hero_moisture,
    },
    {
      parentCategory: catMap['Calcium & Mineral Powders'],
      name: 'Coated Calcium Carbonate (CaCO3)',
      slug: 'coated-calcium-carbonate-caco3',
      order: 4,
      img: IMAGES.coated_calcium_bag,
    },
    {
      parentCategory: catMap['Calcium & Mineral Powders'],
      name: 'Uncoated Calcite Mineral Powder',
      slug: 'uncoated-calcite-mineral-powder',
      order: 5,
      img: IMAGES.calcium_powder_bag,
    },
    {
      parentCategory: catMap['Calcium & Mineral Powders'],
      name: 'Micronized Talcum & Dolomite',
      slug: 'micronized-talcum-and-dolomite',
      order: 6,
      img: IMAGES.talc_bag,
    },
    {
      parentCategory: catMap['Polymer & Plastic Additives'],
      name: 'Masterbatch Functional Fillers',
      slug: 'masterbatch-functional-fillers',
      order: 7,
      img: IMAGES.masterbatch_bag,
    },
    {
      parentCategory: catMap['Polymer & Plastic Additives'],
      name: 'White Pigment & Brightener Additives',
      slug: 'white-pigment-and-brightener-additives',
      order: 8,
      img: IMAGES.pcc_bag,
    },
  ];

  const subCatMap = {};
  for (const sc of subCats) {
    const fd = new FormData();
    fd.append('parentCategory', sc.parentCategory);
    fd.append('name', sc.name);
    fd.append('slug', sc.slug);
    fd.append('order', String(sc.order));
    const filename = path.basename(sc.img);
    fd.append('image', getFileBlob(sc.img, filename), filename);

    await fetch(API_BASE + 'subcategory/create', { method: 'POST', body: fd });
  }

  const res = await fetch(API_BASE + 'subcategory/view');
  const json = await res.json();
  if (json.data) {
    json.data.forEach(item => {
      subCatMap[item.name] = item._id;
    });
  }
  return subCatMap;
}

async function seedSubSubCategories(catMap, subCatMap) {
  console.log('>>> [STEP 7] Seeding 8 Sub-Sub Categories...');
  const subSubCats = [
    {
      parentCategory: catMap['Anti-Moisture Powders'],
      subCategory: subCatMap['Plastic Extrusion Desiccant Powder'],
      name: '800 Mesh High Absorption Desiccant',
      slug: '800-mesh-high-absorption-desiccant',
      order: 1,
      img: IMAGES.anti_moisture_bag,
    },
    {
      parentCategory: catMap['Anti-Moisture Powders'],
      subCategory: subCatMap['Blow Moulding Anti-Moisture Grade'],
      name: '1250 Mesh Blow Film Moisture Powder',
      slug: '1250-mesh-blow-film-moisture-powder',
      order: 2,
      img: IMAGES.user_powder_pile,
    },
    {
      parentCategory: catMap['Anti-Moisture Powders'],
      subCategory: subCatMap['Recycled Polymer Moisture Scavenger'],
      name: 'High-Load Recycling Desiccant Grade',
      slug: 'high-load-recycling-desiccant-grade',
      order: 3,
      img: IMAGES.hero_moisture,
    },
    {
      parentCategory: catMap['Calcium & Mineral Powders'],
      subCategory: subCatMap['Coated Calcium Carbonate (CaCO3)'],
      name: '2500 Mesh Stearic Acid Coated CaCO3',
      slug: '2500-mesh-stearic-acid-coated-caco3',
      order: 4,
      img: IMAGES.coated_calcium_bag,
    },
    {
      parentCategory: catMap['Calcium & Mineral Powders'],
      subCategory: subCatMap['Uncoated Calcite Mineral Powder'],
      name: '500 Mesh Industrial Calcite Powder',
      slug: '500-mesh-industrial-calcite-powder',
      order: 5,
      img: IMAGES.calcium_powder_bag,
    },
    {
      parentCategory: catMap['Calcium & Mineral Powders'],
      subCategory: subCatMap['Micronized Talcum & Dolomite'],
      name: 'Ultra-Fine 3000 Mesh Talc & Soapstone',
      slug: 'ultra-fine-3000-mesh-talc-soapstone',
      order: 6,
      img: IMAGES.talc_bag,
    },
    {
      parentCategory: catMap['Polymer & Plastic Additives'],
      subCategory: subCatMap['Masterbatch Functional Fillers'],
      name: 'PP/PE Film Modifier Mineral Filler',
      slug: 'pp-pe-film-modifier-mineral-filler',
      order: 7,
      img: IMAGES.masterbatch_bag,
    },
    {
      parentCategory: catMap['Polymer & Plastic Additives'],
      subCategory: subCatMap['White Pigment & Brightener Additives'],
      name: 'Optical Brightener Polymer Powder',
      slug: 'optical-brightener-polymer-powder',
      order: 8,
      img: IMAGES.pcc_bag,
    },
  ];

  const subSubCatMap = {};
  for (const ssc of subSubCats) {
    const fd = new FormData();
    fd.append('parentCategory', ssc.parentCategory);
    fd.append('subCategory', ssc.subCategory);
    fd.append('name', ssc.name);
    fd.append('slug', ssc.slug);
    fd.append('order', String(ssc.order));
    const filename = path.basename(ssc.img);
    fd.append('image', getFileBlob(ssc.img, filename), filename);

    await fetch(API_BASE + 'subsubcategory/create', { method: 'POST', body: fd });
  }

  const res = await fetch(API_BASE + 'subsubcategory/view');
  const json = await res.json();
  if (json.data) {
    json.data.forEach(item => {
      subSubCatMap[item.name] = item._id;
    });
  }
  return subSubCatMap;
}

async function seedProducts(catMap, subCatMap, subSubCatMap, colorMap, matMap) {
  console.log('>>> [STEP 8] Seeding 18 Products...');

  const products = [
    {
      name: 'JGB Ultra-Dry Anti Moisture Powder (25 KG Bag)',
      parentCategory: catMap['Anti-Moisture Powders'],
      subcategory: subCatMap['Plastic Extrusion Desiccant Powder'],
      subsubcategory: subSubCatMap['800 Mesh High Absorption Desiccant'],
      productType: 'Featured',
      price: 1450,
      order: 1,
      colors: [colorMap['Snow White'], colorMap['Bright White']],
      materials: [matMap['Anti-Moisture']],
      sortDescription: 'Industrial Grade 25 KG Bag. Highly effective moisture scavenger for plastic extrusion, blown film, and moulding.',
      longDescription: 'JGB Ultra-Dry Anti Moisture Powder is an active chemical desiccant compound specifically formulated for plastic processors. It chemically absorbs ambient and trapped moisture from polymer resins during extrusion and injection moulding, eliminating gas marks, silver streaks, micro-bubbles, and porosity. Mesh size: 800 Mesh. Active absorption capacity: >25% by weight. Safe for PE, PP, PS, and ABS applications.',
      image: IMAGES.anti_moisture_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.user_anti_moisture],
    },
    {
      name: 'JGB Premium Calcium Carbonate Powder CaCO3 (25 KG Bag)',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Uncoated Calcite Mineral Powder'],
      subsubcategory: subSubCatMap['500 Mesh Industrial Calcite Powder'],
      productType: 'Featured',
      price: 850,
      order: 2,
      colors: [colorMap['Snow White'], colorMap['Cream White']],
      materials: [matMap['CaCO3 Powder']],
      sortDescription: 'Ultra-pure white calcium carbonate powder (CaCO3 98.5%) for rubber, plastics, paints, and masterbatches.',
      longDescription: 'JGB Premium Calcium Carbonate (CaCO3) is extracted from high-purity natural calcite mineral reserves and processed through fine air-classifier milling. Features 98.5% minimum CaCO3 content, whiteness above 97%, and narrow particle distribution. Extensively used in PVC pipes, masterbatches, cable compounds, paints, paper, and polymer extrusion.',
      image: IMAGES.calcium_powder_bag,
      gallery: [IMAGES.user_calcium, IMAGES.pure_powder_pile],
    },
    {
      name: 'JGB Stearic Acid Coated Calcium Powder 2500 Mesh',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Coated Calcium Carbonate (CaCO3)'],
      subsubcategory: subSubCatMap['2500 Mesh Stearic Acid Coated CaCO3'],
      productType: 'Featured',
      price: 1850,
      order: 3,
      colors: [colorMap['Snow White'], colorMap['Pure White']],
      materials: [matMap['CaCO3 Powder'], matMap['Nano PCC']],
      sortDescription: 'Nano-fine 2500 Mesh surface-treated calcium carbonate with superior polymer dispersion and low oil absorption.',
      longDescription: 'JGB Coated Calcium Carbonate 2500 Mesh is treated with premium food-grade stearic acid to ensure complete hydrophobic surface modification. Offers ultra-low oil absorption, exceptional dispersibility in PP/PE matrices, high tensile strength retention, and flawless surface gloss in plastic film extrusion and PVC profile manufacturing.',
      image: IMAGES.coated_calcium_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.calcium_powder_bag],
    },
    {
      name: 'JGB Blow Moulding Anti-Moisture Grade 1250 Mesh',
      parentCategory: catMap['Anti-Moisture Powders'],
      subcategory: subCatMap['Blow Moulding Anti-Moisture Grade'],
      subsubcategory: subSubCatMap['1250 Mesh Blow Film Moisture Powder'],
      productType: 'New',
      price: 1650,
      order: 4,
      colors: [colorMap['Bright White'], colorMap['Snow White']],
      materials: [matMap['Anti-Moisture']],
      sortDescription: 'Specialized 1250 mesh moisture remover for blow moulding hollow containers and multi-layer film extrusion.',
      longDescription: 'Specially engineered for high-precision blow moulding machines and thin-gauge film blowing. Rapidly neutralizes trapped humidity in polymer melt, preventing wall thinning, pinholes, and optical distortion. Compatible with HDPE, LDPE, LLDPE, and PP resins at dosage rates between 1% and 3%.',
      image: IMAGES.user_anti_moisture,
      gallery: [IMAGES.anti_moisture_bag, IMAGES.pure_powder_pile],
    },
    {
      name: 'JGB Heavy Recycled Polymer Desiccant Powder',
      parentCategory: catMap['Anti-Moisture Powders'],
      subcategory: subCatMap['Recycled Polymer Moisture Scavenger'],
      subsubcategory: subSubCatMap['High-Load Recycling Desiccant Grade'],
      productType: 'On Sale',
      price: 1250,
      order: 5,
      colors: [colorMap['Off White'], colorMap['Grey White']],
      materials: [matMap['Anti-Moisture'], matMap['Dolomite Min']],
      sortDescription: 'Cost-effective high-load moisture scavenging powder for recycled plastic scrap, regrind flakes, and post-consumer polymer.',
      longDescription: 'Developed specifically for plastic recyclers handling washed flakes and high-humidity scrap. Eliminates the cost of lengthy drying ovens by absorbing up to 30% moisture in-situ during the extrusion and pelletizing process. Dramatically improves melt flow consistency and tensile strength of recycled granules.',
      image: IMAGES.anti_moisture_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.hero_moisture],
    },
    {
      name: 'JGB Micronized Talc & Soapstone Powder 1250 Mesh',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Micronized Talcum & Dolomite'],
      subsubcategory: subSubCatMap['Ultra-Fine 3000 Mesh Talc & Soapstone'],
      productType: 'New',
      price: 1100,
      order: 6,
      colors: [colorMap['Snow White'], colorMap['Bright White']],
      materials: [matMap['Talc Mineral']],
      sortDescription: 'High purity lamellar talc powder for plastics reinforcement, automotive PP parts, paints, and ceramics.',
      longDescription: 'JGB Micronized Talc Powder features high aspect ratio platy structure (lamellarity) offering superior stiffness, dimensional stability, and heat resistance in polyolefin compounds. Mesh: 1250 Mesh (D97 < 10 microns), Whiteness: >96%, Acid Insolubility: >98%.',
      image: IMAGES.talc_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.dolomite_bag],
    },
    {
      name: 'JGB Dolomite Pure White Mineral Powder',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Micronized Talcum & Dolomite'],
      subsubcategory: subSubCatMap['500 Mesh Industrial Calcite Powder'],
      productType: 'On Sale',
      price: 720,
      order: 7,
      colors: [colorMap['Snow White'], colorMap['Cream White']],
      materials: [matMap['Dolomite Min']],
      sortDescription: 'High whiteness calcium magnesium carbonate mineral powder for paints, wall putty, ceramic tiles, and rubber.',
      longDescription: 'Natural double carbonate of calcium and magnesium [CaMg(CO3)2] processed into ultra-white fine grade powder. Delivers high brightness, excellent chemical inertness, and structural reinforcement for paints, primers, construction sealants, and elastomeric compounds.',
      image: IMAGES.dolomite_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.talc_bag],
    },
    {
      name: 'JGB Masterbatch Additive Powder Grade A',
      parentCategory: catMap['Polymer & Plastic Additives'],
      subcategory: subCatMap['Masterbatch Functional Fillers'],
      subsubcategory: subSubCatMap['PP/PE Film Modifier Mineral Filler'],
      productType: 'Featured',
      price: 2200,
      order: 8,
      colors: [colorMap['Snow White'], colorMap['Pure White']],
      materials: [matMap['Masterbatch']],
      sortDescription: 'High-density mineral filler additive for white masterbatch, desiccant masterbatch, and functional compounding.',
      longDescription: 'High-grade carrier-compatible mineral powder designed for masterbatch compounders. Compatible with twin-screw extruders for high loading rates (up to 80%) with zero agglomeration. Provides uniform dispersion, high thermal stability, and maximum opacity in finished masterbatch pellets.',
      image: IMAGES.masterbatch_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.coated_calcium_bag],
    },
    {
      name: 'JGB Precipitated Calcium Carbonate (PCC 99.9%)',
      parentCategory: catMap['Polymer & Plastic Additives'],
      subcategory: subCatMap['White Pigment & Brightener Additives'],
      subsubcategory: subSubCatMap['Optical Brightener Polymer Powder'],
      productType: 'Featured',
      price: 1650,
      order: 9,
      colors: [colorMap['Snow White'], colorMap['Pure White']],
      materials: [matMap['Nano PCC']],
      sortDescription: 'Synthetically precipitated ultra-pure nano calcium carbonate with controlled crystal morphology and 99.9% whiteness.',
      longDescription: 'JGB Synthesized Precipitated Calcium Carbonate (PCC) features calcite scalenohedral crystal structure for maximum opacity, light scattering, and viscosity control. Ideal for premium sealants, PVC plastisols, inks, high-end automotive coatings, and pharmaceuticals.',
      image: IMAGES.pcc_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.masterbatch_bag],
    },
    {
      name: 'JGB Industrial Calcite Powder 500 Mesh',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Uncoated Calcite Mineral Powder'],
      subsubcategory: subSubCatMap['500 Mesh Industrial Calcite Powder'],
      productType: 'New',
      price: 650,
      order: 10,
      colors: [colorMap['Snow White'], colorMap['Off White']],
      materials: [matMap['CaCO3 Powder']],
      sortDescription: 'Economical 500 mesh calcite powder for rigid PVC pipes, sanitaryware, adhesives, and wall putty formulations.',
      longDescription: 'High-density natural calcite powder ground to 500 mesh standard. High calcium content (>97%), excellent bulk density, and consistent particle sizing for seamless high-speed extrusion line processing.',
      image: IMAGES.calcium_powder_bag,
      gallery: [IMAGES.user_calcium, IMAGES.dolomite_bag],
    },
    {
      name: 'JGB Film Grade Anti-Moisture Additive Compound',
      parentCategory: catMap['Anti-Moisture Powders'],
      subcategory: subCatMap['Plastic Extrusion Desiccant Powder'],
      subsubcategory: subSubCatMap['800 Mesh High Absorption Desiccant'],
      productType: 'New',
      price: 1750,
      order: 11,
      colors: [colorMap['Snow White'], colorMap['Bright White']],
      materials: [matMap['Anti-Moisture']],
      sortDescription: 'Advanced moisture absorber formulated specifically for monolayer and multilayer shopping bag & liner film manufacturing.',
      longDescription: 'Specially milled to prevent die build-up, screen blocking, and bubble instability in high-speed blown film plants. Reduces bubble tear-offs and maintains film elongation properties even at high filler loading.',
      image: IMAGES.anti_moisture_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.user_anti_moisture],
    },
    {
      name: 'JGB Injection Moulding Desiccant Powder',
      parentCategory: catMap['Anti-Moisture Powders'],
      subcategory: subCatMap['Blow Moulding Anti-Moisture Grade'],
      subsubcategory: subSubCatMap['1250 Mesh Blow Film Moisture Powder'],
      productType: 'On Sale',
      price: 1350,
      order: 12,
      colors: [colorMap['Off White'], colorMap['Bright White']],
      materials: [matMap['Anti-Moisture']],
      sortDescription: 'Eliminates splay marks, flow lines, and trapped moisture bubbles in engineering plastic injection moulding.',
      longDescription: 'Fast-reacting desiccant chemical powder for injection moulding of household goods, automotive components, and industrial fittings. Eliminates the need for pre-drying hygroscopic polymers like ABS, SAN, and filled PP.',
      image: IMAGES.user_anti_moisture,
      gallery: [IMAGES.anti_moisture_bag, IMAGES.calcium_powder_bag],
    },
    {
      name: 'JGB Nano-Coated Calcium Mineral Powder 3000 Mesh',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Coated Calcium Carbonate (CaCO3)'],
      subsubcategory: subSubCatMap['2500 Mesh Stearic Acid Coated CaCO3'],
      productType: 'Featured',
      price: 2400,
      order: 13,
      colors: [colorMap['Snow White'], colorMap['Pure White']],
      materials: [matMap['CaCO3 Powder'], matMap['Nano PCC']],
      sortDescription: 'Sub-micron 3000 mesh organic coated calcium carbonate for high-speed breathable film and cable compounding.',
      longDescription: 'Top-tier surface-modified nano mineral powder providing superior elongation at break, impact resistance, and water vapor transmission rate in microporous breathable films and premium wire jacketing.',
      image: IMAGES.coated_calcium_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.pcc_bag],
    },
    {
      name: 'JGB PP & PE Extrusion Modifier Mineral Filler',
      parentCategory: catMap['Polymer & Plastic Additives'],
      subcategory: subCatMap['Masterbatch Functional Fillers'],
      subsubcategory: subSubCatMap['PP/PE Film Modifier Mineral Filler'],
      productType: 'New',
      price: 1550,
      order: 14,
      colors: [colorMap['Bright White'], colorMap['Snow White']],
      materials: [matMap['Masterbatch'], matMap['CaCO3 Powder']],
      sortDescription: 'Reinforcing mineral modifier powder for polypropylene woven sacks, tarpaulins, and raffia tapes.',
      longDescription: 'Optimized particle aspect ratio prevents fibrillation loss and yarn breakage on high-speed circular looms. Enhances tape stiffness, reduces anti-split additive requirements, and lowers polymer consumption costs.',
      image: IMAGES.masterbatch_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.talc_bag],
    },
    {
      name: 'JGB High Purity Soapstone Industrial Powder',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Micronized Talcum & Dolomite'],
      subsubcategory: subSubCatMap['Ultra-Fine 3000 Mesh Talc & Soapstone'],
      productType: 'New',
      price: 890,
      order: 15,
      colors: [colorMap['Snow White'], colorMap['Cream White']],
      materials: [matMap['Talc Mineral']],
      sortDescription: 'Lustrous, super-soft natural soapstone talcum powder for cosmetic foundations, paper smoothness, and rubber dusting.',
      longDescription: 'Exceptionally smooth soapy feel, 98% pure talc mineral with zero asbestos content. High brightness, low abrasiveness, and high slip resistance for paper coating, industrial talc dusting, and cosmetics.',
      image: IMAGES.talc_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.dolomite_bag],
    },
    {
      name: 'JGB Rigid PVC Grade Calcium Carbonate 800 Mesh',
      parentCategory: catMap['Calcium & Mineral Powders'],
      subcategory: subCatMap['Uncoated Calcite Mineral Powder'],
      subsubcategory: subSubCatMap['500 Mesh Industrial Calcite Powder'],
      productType: 'On Sale',
      price: 1050,
      order: 16,
      colors: [colorMap['Snow White'], colorMap['Off White']],
      materials: [matMap['CaCO3 Powder']],
      sortDescription: 'Engineered for CPVC/UPVC pipe fittings, electrical conduits, and window profile extruders.',
      longDescription: 'Controlled particle distribution ensures maximum fusion rate in PVC twin-screw extruders. Delivers glossy surface finish, high Vicat softening temperature, and superior Izod impact strength.',
      image: IMAGES.calcium_powder_bag,
      gallery: [IMAGES.user_calcium, IMAGES.coated_calcium_bag],
    },
    {
      name: 'JGB Optical Brightener Polymer Powder OB-1',
      parentCategory: catMap['Polymer & Plastic Additives'],
      subcategory: subCatMap['White Pigment & Brightener Additives'],
      subsubcategory: subSubCatMap['Optical Brightener Polymer Powder'],
      productType: 'Featured',
      price: 3200,
      order: 17,
      colors: [colorMap['Pure White'], colorMap['Snow White']],
      materials: [matMap['Nano PCC'], matMap['Masterbatch']],
      sortDescription: 'High-potency fluorescent whitening agent powder for masking yellowness in plastics and synthetic fibers.',
      longDescription: 'High-temperature resistant fluorescent whitening powder. Absorbs ultraviolet radiation and re-emits visible blue light, transforming dull or recycled polymers into ultra-brilliant snow-white commercial products.',
      image: IMAGES.pcc_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.masterbatch_bag],
    },
    {
      name: 'JGB Blow Film Specialized Moisture Scavenger',
      parentCategory: catMap['Anti-Moisture Powders'],
      subcategory: subCatMap['Blow Moulding Anti-Moisture Grade'],
      subsubcategory: subSubCatMap['1250 Mesh Blow Film Moisture Powder'],
      productType: 'Featured',
      price: 1600,
      order: 18,
      colors: [colorMap['Snow White'], colorMap['Bright White']],
      materials: [matMap['Anti-Moisture']],
      sortDescription: 'Ultra-fine reactive desiccant powder for high-speed multi-layer blown film and barrier pouches.',
      longDescription: 'Provides maximum moisture binding power without affecting corona treatment, printability, or seal strength of polyethylene and polypropylene packaging films. 25 KG moisture-proof bag packaging.',
      image: IMAGES.anti_moisture_bag,
      gallery: [IMAGES.pure_powder_pile, IMAGES.user_anti_moisture],
    },
  ];

  for (const p of products) {
    const fd = new FormData();
    fd.append('name', p.name);
    fd.append('parentCategory', p.parentCategory);
    fd.append('subcategory', p.subcategory);
    fd.append('subsubcategory', p.subsubcategory);
    fd.append('productType', p.productType);
    fd.append('price', String(p.price));
    fd.append('order', String(p.order));
    fd.append('sortDescription', p.sortDescription);
    fd.append('longDescription', p.longDescription);

    if (p.colors && p.colors.length > 0) {
      p.colors.forEach(cid => {
        if (cid) fd.append('color[]', cid);
      });
    }
    if (p.materials && p.materials.length > 0) {
      p.materials.forEach(mid => {
        if (mid) fd.append('material[]', mid);
      });
    }

    const mainFilename = path.basename(p.image);
    fd.append('image', getFileBlob(p.image, mainFilename), mainFilename);

    if (p.gallery && p.gallery.length > 0) {
      for (const gImg of p.gallery) {
        const gFilename = path.basename(gImg);
        fd.append('gallery', getFileBlob(gImg, gFilename), gFilename);
      }
    }

    await fetch(API_BASE + 'product/create', { method: 'POST', body: fd });
  }
}

async function seedSliders() {
  console.log('>>> [STEP 9] Seeding Sliders...');
  const sliders = [
    {
      title: 'JGB Trading — Premier Industrial Chemical Powders',
      link: '/product/view',
      order: 1,
      image: IMAGES.hero_factory,
    },
    {
      title: 'Advanced Anti-Moisture Powder for Plastic & Polymer Processing',
      link: '/product/view',
      order: 2,
      image: IMAGES.hero_moisture,
    },
    {
      title: 'Ultra-Fine Calcium Carbonate & Micronized Mineral Powders',
      link: '/product/view',
      order: 3,
      image: IMAGES.hero_calcium,
    },
  ];

  for (const s of sliders) {
    const fd = new FormData();
    fd.append('title', s.title);
    fd.append('link', s.link);
    fd.append('order', String(s.order));
    const filename = path.basename(s.image);
    fd.append('image', getFileBlob(s.image, filename), filename);

    await fetch(API_BASE + 'slider/create', { method: 'POST', body: fd });
  }
}

async function seedFaqs() {
  console.log('>>> [STEP 10] Seeding FAQs...');
  const faqs = [
    {
      q: 'What is the primary function of JGB Anti-Moisture Powder?',
      answer: 'JGB Anti-Moisture Powder is an industrial-grade chemical desiccant additive specifically engineered to eliminate moisture, surface defects, silver streaks, and porosity in plastic extrusion, blow moulding, and recycled polymer processing without requiring prior drying.',
      order: 1,
    },
    {
      q: 'What mesh sizes are available for JGB Calcium Carbonate and Talc Powders?',
      answer: 'We supply calcium carbonate and talc mineral powders in mesh sizes ranging from 300 Mesh (coarse calcite) up to 2500 Mesh and 3000 Mesh (ultra-fine stearic acid coated nano grades) with whiteness exceeding 98%.',
      order: 2,
    },
    {
      q: 'What is the standard packaging size for JGB Industrial Powders?',
      answer: 'Standard commercial packaging is 25 KG multi-layer moisture-proof HDPE/PP woven bags with internal liner. We also provide 50 KG bags and 1,000 KG (1 MT) jumbo bags upon bulk request.',
      order: 3,
    },
    {
      q: 'What is the recommended dosage for Anti-Moisture Powder in recycled plastic?',
      answer: 'For standard virgin polymers with mild moisture, a 1% to 2% dosage is typical. For recycled granules or high-humidity raw materials, recommended dosage is 2% to 5% by total weight.',
      order: 4,
    },
    {
      q: 'Do you provide Certificate of Analysis (COA) and lab test reports?',
      answer: 'Yes, every batch manufactured and dispatched by JGB Trading is tested in our quality control lab and accompanied by a detailed Certificate of Analysis (COA) verifying purity, particle distribution, and whiteness.',
      order: 5,
    },
    {
      q: 'What is the Minimum Order Quantity (MOQ) and delivery lead time?',
      answer: 'Minimum order quantity for domestic orders is 500 KG (20 bags of 25 KG). Ready stock is dispatched within 24-48 hours across pan-India transport networks and major export ports.',
      order: 6,
    },
  ];

  for (const f of faqs) {
    await fetch(API_BASE + 'faq/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
  }
}

async function seedWhyChooseUs() {
  console.log('>>> [STEP 11] Seeding Why Choose Us...');
  const items = [
    {
      title: '99.8% Certified Chemical Purity',
      description: 'Rigorous laboratory testing ensures ultra-high brightness, consistent mesh particle size, and maximum active moisture absorption efficiency.',
      rating: 4.9,
      order: 1,
      image: IMAGES.quality_lab,
    },
    {
      title: 'Triple-Layer Moisture-Lock Packaging',
      description: 'Vacuum-sealed, heavy-duty 25 KG HDPE/PP woven bags with virgin polymer liners protect the powder from atmospheric humidity during transit.',
      rating: 5.0,
      order: 2,
      image: IMAGES.anti_moisture_bag,
    },
    {
      title: 'Custom Mesh Sizing (300 to 3000 Mesh)',
      description: 'State-of-the-art air classifier mills allow custom micronization and surface stearic acid coating for specialized industrial applications.',
      rating: 4.8,
      order: 3,
      image: IMAGES.coated_calcium_bag,
    },
    {
      title: 'Pan-India Fast Dispatch & Global Export',
      description: 'Strategic warehouses and freight logistics network ensure same-day dispatch and reliable delivery across all major industrial belts.',
      rating: 4.9,
      order: 4,
      image: IMAGES.logistics,
    },
    {
      title: 'Direct Manufacturer Pricing & Bulk Capacity',
      description: 'Eliminating middleman margins to provide top-tier industrial raw material powders at direct factory-level bulk rates.',
      rating: 4.9,
      order: 5,
      image: IMAGES.calcium_powder_bag,
    },
  ];

  for (const w of items) {
    const fd = new FormData();
    fd.append('title', w.title);
    fd.append('description', w.description);
    fd.append('rating', String(w.rating));
    fd.append('order', String(w.order));
    const filename = path.basename(w.image);
    fd.append('image', getFileBlob(w.image, filename), filename);

    await fetch(API_BASE + 'whychooseus/create', { method: 'POST', body: fd });
  }
}

async function run() {
  await wipeAll();
  const colorMap = await seedColors();
  const matMap = await seedMaterials();
  await seedCountries();
  const catMap = await seedCategories();
  const subCatMap = await seedSubCategories(catMap);
  const subSubCatMap = await seedSubSubCategories(catMap, subCatMap);
  await seedProducts(catMap, subCatMap, subSubCatMap, colorMap, matMap);
  await seedSliders();
  await seedFaqs();
  await seedWhyChooseUs();
  console.log('✅ ALL DATA SEEDED SUCCESSFULLY!');
}

run();
