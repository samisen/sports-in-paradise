/**
 * Photography.
 *
 * Every image on the site is an Unsplash photo served from the Unsplash CDN
 * (an imgix host), so the browser is handed a correctly sized, modern-format
 * file through the loader in app.config.ts rather than a 6000px original.
 * Unsplash Plus images are excluded: everything here is under the free
 * Unsplash licence, and the photographer is credited where the photo appears.
 *
 * `w` and `h` are the original dimensions — NgOptimizedImage uses the ratio
 * to reserve space before the file arrives, so nothing shifts on load.
 */

export interface Photo {
  /** The Unsplash CDN path, without host or query. */
  id: string;
  w: number;
  h: number;
  by: string;
  alt: string;
}

const p = (id: string, w: number, h: number, by: string, alt: string): Photo => ({
  id: `photo-${id}`,
  w,
  h,
  by,
  alt,
});

export const PHOTOS = {
  padel: {
    racketsCourt: p('1646649853703-7645147474ba', 15945, 10629, 'Vincenzo Morelli', 'Two padel rackets and balls on a blue court, seen from above'),
    racketsCircle: p('1658723826297-fe4d1b1e6600', 3024, 4032, 'Sergio Contreras', 'Four padel rackets laid in a circle with yellow balls'),
    racketHand: p('1612534847738-b3af9bc31f0c', 6000, 4000, 'Manuel Pappacena', 'A hand holding an orange and blue padel racket'),
    playerCourt: p('1646649851800-48dba35edc76', 15945, 10629, 'Vincenzo Morelli', 'A padel player waiting at the net on a blue court'),
    smash: p('1646651105426-e8c8ee9badde', 10629, 15945, 'Vincenzo Morelli', 'A padel player reaching up for an overhead'),
    racketsLines: p('1646649853517-e2f75cde1908', 15945, 10629, 'Vincenzo Morelli', 'Padel rackets on the white lines of a blue court'),
    pair: p('1646649852033-7e0f3d679f8b', 15945, 10629, 'Vincenzo Morelli', 'Two padel players shaking hands across the court'),
    lunge: p('1646649852046-b758d2d573f3', 15945, 10629, 'Vincenzo Morelli', 'A player stretching low for a ball on a padel court'),
    ready: p('1646651105454-6c167ea6f83b', 10629, 15945, 'Vincenzo Morelli', 'A padel player in the ready position'),
    courtGlass: p('1689942963385-f5bd03f3b270', 6240, 4160, 'José Alejandro Cuffia', 'A blue padel court behind its glass walls'),
    courtsTall: p('1709587825415-814c2d7cfce7', 3376, 6000, 'Bruno Vaccaro Vercellino', 'Outdoor padel courts under an open sky'),
    courtsOutdoor: p('1709587824751-dd30420f5cf3', 6000, 3376, 'Bruno Vaccaro Vercellino', 'A row of outdoor padel courts with glass and mesh'),
    racketsBalls: p('1658723745294-89c5e056efb5', 3024, 4032, 'Sergio Contreras', 'A pair of padel rackets and balls on the ground'),
  },
  tennis: {
    fromAbove: p('1545151414-8a948e1ea54f', 3456, 5184, 'Renith R', 'A tennis player on a green court, seen from above'),
    courtTrees: p('1499510318569-1a3d67dc3976', 2196, 2745, 'Ryan Searle', 'Aerial view of a tennis court surrounded by trees'),
    racket: p('1622163642998-1ea32b0bbc67', 3024, 4032, 'Hoi Pham', 'A tennis racket and ball on a blue court'),
    balls: p('1595435742656-5272d0b3fa82', 4024, 5030, 'Jeffery Erhunse', 'A player holding a racket and two tennis balls'),
    serve: p('1714840961998-8d6c02ace00b', 3200, 4800, 'Andrew Heald', 'A tennis player tossing the ball to serve'),
    aerialPlayer: p('1548920168-70d61248a912', 6000, 4000, 'Prashant Gurung', 'A tennis player and her long shadow on court'),
    serveDark: p('1637071692126-d0ee7df18271', 4000, 6000, 'Fei Chao', 'A tennis player serving under floodlights'),
    blueCourt: p('1714840961579-6b072a12536e', 4068, 2654, 'Andrew Heald', 'A tennis player moving on a blue hard court'),
    forehand: p('1714841197541-aa64d90cb6a8', 3200, 3601, 'Andrew Heald', 'A tennis player swinging through a forehand'),
    rally: p('1516742720271-6ae39cbc5bd1', 5184, 3888, 'flou gaupr', 'A tennis player in a rally on a hard court'),
    serveTall: p('1714841197683-9bb219f6dca5', 3200, 4800, 'Andrew Heald', 'A tennis player at full stretch on the serve'),
    palms: p('1763913771541-4d43d5c3bc93', 5827, 3885, 'Michael Moloney', 'Empty tennis courts lined with palm trees under a clear sky'),
    net: p('1699117686612-ece525e4f91a', 3712, 5568, 'C Cai', 'A tennis net across a blue court'),
  },
  golf: {
    oceanCliff: p('1672825952732-ecef34882416', 4000, 6000, 'Frederik Rosar', 'A golf course above the ocean'),
    greenHills: p('1679011734667-165e56d79037', 9072, 16128, 'Caleb Bennetts', 'A green fairway rolling into wooded hills'),
    palmsSunset: p('1557877086-55d8d99cdec2', 4032, 3024, 'Derick McKinney', 'Palm trees and a water hazard at sunset'),
    palmsLake: p('1557877086-af138221a600', 4032, 3024, 'Derick McKinney', 'Palms reflected in a lake on a golf course'),
    carts: p('1774905175014-5f9de3e9c2d1', 8249, 4640, 'Y S', 'Golf carts on a lush green course'),
    bunkers: p('1777556597830-368613d1d26d', 4311, 2874, 'Margo Evardson', 'Sand traps cut into a green, tree-lined course'),
    swing: p('1611374243147-44a702c2d44c', 6163, 4109, 'Mick Haupt', 'A golfer at the top of his swing'),
    bunkerShot: p('1632244112951-95b29c92eee1', 4242, 3988, 'Peter Drew', 'A golfer playing out of a bunker'),
    sunsetSwing: p('1696104470342-b1ed3afe8381', 4104, 2736, 'Mike Cox', 'A golfer swinging in low evening light'),
    driver: p('1690288505632-bb7f38d663d4', 4367, 6550, 'Yianni Mathioudakis', 'A golf ball teed up beside the driver'),
    splash: p('1662224107342-c2bfd01a17f1', 6000, 4000, 'Virgile Donadieu', 'Sand flying from a bunker shot'),
    sunrise: p('1752661497402-5b3b6743d66a', 5907, 3938, 'Ferdinand Forster', 'A golfer swinging on an open course in early sun'),
    palmsOcean: p('1779288896759-e3d27ffeebf5', 5073, 2854, 'Taylor Chausky', 'Palm fronds framing a green golf course by the ocean'),
    byTheSea: p('1732654344700-975e39956d9b', 4032, 3024, 'Maarten Zaanen', 'A golfer on a course beside the sea'),
    flag: p('1730372645289-7f26ac10fcdf', 7952, 4472, 'Frederik Rosar', 'A golfer beside the flag on a green'),
    buggy: p('1730372609361-0049718f5957', 7952, 4472, 'Frederik Rosar', 'A golfer standing next to a golf cart'),
    seaSwing: p('1766584006994-be9d51c13543', 3059, 4589, 'Joe Francis', 'A golfer swinging on a sunny day by the ocean'),
    bunkerEvening: p('1538648759472-7251f7cb2c2f', 4032, 3024, 'Edwin Compton', 'A bunker and green in evening light'),
    cup: p('1587174486073-ae5e5cff23aa', 6240, 4160, 'Soheb Zaidi', 'A golf ball on the lip of the cup'),
    aerialGreen: p('1605144884374-ecbb643615f6', 3336, 4944, 'Welcome', 'A green and its bunkers from the air'),
    tee: p('1562204320-31975a5e09ce', 6073, 4160, 'Will Porada', 'A golf ball sitting on a tee'),
    putt: p('1532508583690-538a1436f423', 3008, 2000, 'Mick De Paola', 'A putter lined up behind a golf ball'),
  },
  diving: {
    cave: p('1682687982167-d7fb3ed8541d', 7733, 5155, 'NEOM', 'A scuba diver swimming through an underwater cave'),
    reef: p('1583212292454-1fe6229603b7', 3648, 2736, 'Hiroko Yoshii', 'Fish over a shallow coral reef'),
    schoolDiver: p('1544551763-46a013bb70d5', 5472, 3648, 'Sebastian Pena Lambarri', 'A diver beside a school of yellow fish'),
    silhouette: p('1517627043994-b991abb62fc8', 5304, 7380, 'Francisco Jesús Navarro Hernández', 'A diver silhouetted against the sun from below'),
    camera: p('1682687982502-1529b3b33f85', 8256, 5504, 'NEOM', 'A diver with a camera over the reef'),
    fishDiver: p('1586508577428-120d6b072945', 4000, 2500, 'Aviv Perets', 'A diver in a wetsuit among a school of fish'),
    colourReef: p('1682687981630-cefe9cd73072', 7406, 4937, 'NEOM', 'A diver over a colourful coral reef'),
    manta: p('1618265909156-0507770ef0d0', 2668, 3484, 'naushad mohamed', 'A manta ray gliding overhead'),
    mantas: p('1544552866-fef1d68c69b5', 5472, 3648, 'Sebastian Pena Lambarri', 'Manta rays feeding in blue water'),
    mantaBelly: p('1604294069552-a94330e12a33', 5168, 3448, 'Andre Kaim', 'A manta ray showing its pale underside'),
    mantaShadow: p('1582012446386-1682363c2f1c', 2250, 2250, 'Mohamed Nashah', 'A manta ray silhouetted against the surface'),
    mantaGlide: p('1604294069613-a76c24206361', 5168, 3448, 'Andre Kaim', 'A manta ray swimming close to the reef'),
    coralDiver: p('1682687982049-b3d433368cd1', 8024, 5349, 'NEOM', 'A diver swimming over a coral reef'),
    fishWall: p('1682687982360-3fbab65f9d50', 8256, 5504, 'NEOM', 'A diver surrounded by fish'),
    reefDiver: p('1682687982470-8f1b0e79151a', 8256, 5504, 'NEOM', 'A diver drifting past a reef wall full of fish'),
    splitVolcano: p('1682695797873-aa4cb6edd613', 8189, 5462, 'NEOM', 'A half-underwater view of a reef with a mountain above the waterline'),
    surface: p('1581771085083-2353cf475ff5', 4851, 3234, 'Uber Scuba Gili', 'Divers at the surface before a descent'),
    statue: p('1544642058-2d2bfc88a86a', 4939, 3293, 'Sebastian Pena Lambarri', 'A diver beside an underwater statue'),
    shoal: p('1515474594679-6a13c25afb99', 5437, 3625, 'Milos Prelevic', 'A dense shoal of silver fish'),
    nudibranch: p('1578854186802-b234962d05bc', 4608, 3072, 'Pascal van de Vendel', 'A small orange and white nudibranch'),
    turtle: p('1437622368342-7a3d73a34c8f', 1920, 1200, 'Wexor Tmg', 'A sea turtle swimming underwater'),
    turtleBlue: p('1710668167382-18a14edf253d', 2160, 3840, 'Sercan Jenkins', 'A sea turtle gliding through blue water'),
    turtleReef: p('1554555263-f440a3f535f3', 4272, 2848, 'Zdeněk Macháček', 'A sea turtle over the reef'),
    turtleClear: p('1759202096361-809b7e083709', 1702, 3018, 'Flaviu Costin', 'A sea turtle in clear blue water'),
  },
  hiking: {
    baturClouds: p('1508591086314-d7deb00cede9', 6868, 4584, 'Hugo Villegas', 'A volcano rising above a sea of cloud at sunrise'),
    agungFromBatur: p('1518730573647-359c73385dc5', 4000, 2250, 'Juan Cruz Mountford', 'Mount Agung seen across the clouds from a ridge'),
    ridgeGroup: p('1683577105164-890a53e115d6', 6000, 4000, 'Pavan Tirumani', 'A group of hikers walking up a mountain ridge'),
    summitSunset: p('1693328298047-b6a437ec99d9', 3024, 4032, 'Kshitij', 'A hiker on a summit at sunset'),
    valleyClouds: p('1658923951137-ba6003e9b7fa', 2000, 3000, 'Michael Huang', 'Mountains above a cloud-filled valley'),
    sunriseHiker: p('1519401515635-cecff1f60e6c', 5621, 3665, 'Frankie Spontelli', 'A hiker crouched on a summit at sunrise'),
    aboveClouds: p('1691566509578-44f53908e2c2', 3088, 4416, 'Arya Krisdyantara', 'A hiker sitting above the clouds'),
    cloudPeak: p('1691502692544-24a588f8069c', 2250, 4000, 'Arya Krisdyantara', 'A volcanic peak wrapped in cloud'),
    range: p('1681390852996-d7ca802bc4be', 5472, 3648, 'Gede Pranata', 'A mountain range behind forest'),
    terraceWalker: p('1558005530-a7958896ec60', 3000, 1999, 'Geio Tischler', 'A person walking through green rice terraces below a volcano'),
    palmHillside: p('1682406187130-84561b4e0e78', 2268, 4032, 'Anna Garden', 'A green hillside of palms and terraces'),
    couple: p('1544091441-9cca7fbe8923', 6000, 3376, 'arty', 'Two walkers looking out over a green hill'),
    terraces: p('1628697723581-fd4ec5c38ab0', 5472, 3648, 'Frans Daniels', 'Stepped rice terraces in morning light'),
    terracesTall: p('1709105188196-7e7689e3fb6b', 3190, 5111, 'Katarzyna Zygnerska', 'A hillside of terraces and trees'),
    fieldWalk: p('1572385524110-1e42bc2394d8', 3989, 5976, 'Radosław Molski', 'A woman walking along a rice field'),
    agungTemple: p('1643761529661-0479c319d8f0', 3696, 2464, 'Bill Fairs', 'A temple statue in front of Mount Agung'),
    agungCloud: p('1593332956867-9d99a3bb9109', 3456, 5184, 'Dendy Darma Satyazi', 'Mount Agung under white cloud'),
    lookout: p('1510037056621-d2508afab0dd', 4896, 3264, '东旭 王', 'A hiker with a backpack looking at a volcano'),
    palmsMountain: p('1664889050657-5ec9abd9ca00', 6000, 4000, 'Tom Donders', 'Palm trees in front of a mountain'),
    hut: p('1523539693385-e5e891eb4465', 2287, 3416, 'Claudia Fernández Ortiz', 'A small hut in terraced rice fields'),
    terracesAerial: p('1513415756790-2ac1db1297d0', 4000, 3000, 'Jason Cooper', 'Rice terraces from the air'),
    waterfalls: p('1554931670-4ebfabf6e7a9', 4160, 6240, 'Aleksandra Dementeva', 'Cascading waterfalls in the jungle'),
    cascade: p('1695611280324-a5f9b8e8594e', 9504, 5930, 'Karthik Sreenivas', 'A wide waterfall cascading over mossy rock'),
    forestFall: p('1593901138884-02ee723a96f7', 4689, 5861, 'Rolands Varsbergs', 'A waterfall in green forest'),
    river: p('1578494688088-8260d62a79c1', 3086, 4629, 'Frans Daniels', 'A waterfall and river in the forest'),
    twinFalls: p('1598960383478-bcc6dddb4781', 3918, 7148, 'Maxim Romanyuk', 'Twin waterfalls over dark rock'),
  },
  bali: {
    penidaBeach: p('1577717903315-1691ae25ab3f', 6000, 4000, 'Alfiano Sutianto', 'Turquoise water below limestone cliffs on Nusa Penida'),
    ulunDanu: p('1604999333679-b86d54738315', 5000, 4000, 'Guillaume Marques', 'A temple on the water of a highland lake'),
    tegalalang: p('1555400038-63f5ba517a47', 6000, 4000, 'Niklas Weiss', 'Green rice terraces with palms in Tegalalang'),
    kelingking: p('1539367628448-4bc5c9d171c8', 3024, 4032, 'Alec Favale', 'A cliff headland above the sea, from the air'),
    lempuyang: p('1537953773345-d172ccf13cf1', 6123, 8164, 'Road Trip with Raj', 'A person between the split stone gates of Lempuyang temple'),
    tanahLot: p('1518548419970-58e3b4079ab2', 3456, 2304, 'Harry Kessell', 'Tanah Lot temple on its rock at golden hour'),
    goldenBeach: p('1507525428034-b723cf961d3e', 4621, 3072, 'Sean Oulashin', 'A beach at golden hour'),
    turquoise: p('1559305289-4c31700ba9cb', 2826, 2122, 'felfin felfin', 'Turquoise water breaking on a beach'),
    sunsetRocks: p('1588625224664-a561c1f5f619', 5184, 3888, 'Mauro-Fabio Cilurzo', 'People on the rocks at sunset by the sea'),
    uluwatuTemple: p('1604842937136-1648761a6256', 3605, 4506, 'Polina Kuzovkova', 'A temple on the clifftop above the ocean'),
    uluwatuCliffs: p('1598751240191-fbe4a9a30e02', 5713, 3809, 'Jared Schwitzke', 'Limestone cliffs above a blue sea'),
    cliffPool: p('1700512825803-b2569dc8e094', 3394, 4520, 'Lisa van Vliet', 'A rocky cliff with water in the foreground'),
    beachAerial: p('1587015539329-5f95ae6c1ee8', 4032, 2684, 'Max Kukurudziak', 'A long beach and turquoise water from above'),
    coast: p('1636619306699-2d27a100605e', 4896, 3264, 'Alexandra Smielova', 'The ocean and a green cliff coast'),
    rockTemple: p('1553902000-e036b7d05af5', 5472, 3648, 'Nick Fewings', 'A temple on a rock in the sea'),
    villaPool: p('1692736933760-8a8a9b8c1b6f', 8064, 6048, 'Shawn', 'A villa pool with a table and chairs'),
    poolChairs: p('1651108066220-f61c22fc281f', 3264, 4928, 'Alexander Davies', 'A pool with loungers under a tree'),
    villaAerial: p('1728048756938-de1ccee0ab15', 5464, 3640, 'Antonio Araujo', 'A villa and its pool from the air'),
    resortAerial: p('1694967832949-09984640b143', 5464, 3640, 'Antonio Araujo', 'A tropical resort with a pool, from the air'),
    palmSunset: p('1616484173745-07f25fd0547f', 2268, 4032, 'Muhammad Novrijal', 'Palm trees silhouetted at sunset'),
    agungDusk: p('1505487985217-c1f95816212d', 3178, 3973, 'resa cahya', 'A volcano under an orange dawn sky'),
    surferSunset: p('1581164197999-99c7d65e8805', 3728, 2883, 'Nabeel Hussain', 'A surfer walking along the beach at sunset'),
    sanurDawn: p('1733281120650-b6898966f797', 4896, 3264, 'Didi Suprapta', 'A small island at dawn off a calm beach'),
    dock: p('1614914150006-b69fee3aa650', 2586, 3879, 'visualsofdana', 'A person on a dock at sunset'),
    calmSea: p('1733281121131-6aa280eab10f', 4761, 3069, 'Didi Suprapta', 'A small island in calm water'),
  },
  life: {
    yogaDeck: p('1506126613408-eca07ce68773', 2202, 2560, 'Jared Rice', 'Yoga on a wooden deck at sunrise'),
    yogaDock: p('1600618528240-fb9fc964b853', 6277, 4185, 'Jared Rice', 'Meditation on a wooden dock at sunrise'),
    yogaBeach: p('1509684420792-749974015823', 3000, 2000, 'Avrielle Ali', 'Stretching on the beach at sunset'),
    acai: p('1627308594190-a057cd4bfac8', 3173, 4230, 'Vicky Ng', 'Two açaí bowls with fruit and granola'),
    poke: p('1602881917445-0b1ba001addf', 5304, 5304, 'David Foodphototasty', 'A fresh poke bowl'),
    smoothie: p('1590301157284-ab2f8707bdc1', 3456, 4608, 'Vicky Ng', 'A smoothie bowl with berries'),
    coldWater: p('1440133197387-5a6020d5ace2', 3515, 5273, 'Hisu lee', 'Floating in cold water'),
    surfboardSunset: p('1567491764093-be7719ad441d', 4000, 6000, 'Hc Digital', 'A surfer holding a board at sunset'),
    surfing: p('1607537826640-5ca23e6df221', 4729, 3153, 'Renan Brun', 'A surfer on a breaking wave'),
    surfPalms: p('1701938541293-55007984ac32', 3570, 5355, 'I G Adhiputra Satyawibawa', 'A surfer carrying a board through the palms'),
  },
} as const;

/** A full URL, for the rare place that cannot use NgOptimizedImage (CSS, meta tags). */
export function photoUrl(photo: Photo, width: number, quality = 70): string {
  return `https://images.unsplash.com/${photo.id}?auto=format&fit=crop&q=${quality}&w=${width}`;
}
