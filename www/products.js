/* Bozor röyxati uçun tayyor mahsulotlar: [özbekça, ruscha, inglizça, ölçov, kategoriya] */
const PRODUCTS = [
  // sabzavotlar
  ['Pomidor', 'Помидоры', 'Tomatoes', 'kg', 'food'], ['Bodring', 'Огурцы', 'Cucumbers', 'kg', 'food'], ['Kartoşka', 'Картофель', 'Potatoes', 'kg', 'food'],
  ['Piyoz', 'Лук', 'Onions', 'kg', 'food'], ['Sabzi', 'Морковь', 'Carrots', 'kg', 'food'], ['Sarimsoq', 'Чеснок', 'Garlic', 'kg', 'food'],
  ['Karam', 'Капуста', 'Cabbage', 'kg', 'food'], ['Bulğor qalampiri', 'Болгарский перец', 'Bell peppers', 'kg', 'food'], ['Achchiq qalampir', 'Острый перец', 'Chili peppers', 'kg', 'food'],
  ['Baqlajon', 'Баклажаны', 'Eggplants', 'kg', 'food'], ['Qovoq', 'Тыква', 'Pumpkin', 'kg', 'food'], ['Lavlagi', 'Свёкла', 'Beets', 'kg', 'food'],
  ['Turp', 'Редька', 'Radish', 'kg', 'food'], ['Şolğom', 'Репа', 'Turnip', 'kg', 'food'], ['Qovoqça', 'Кабачки', 'Zucchini', 'kg', 'food'],
  ['Kök piyoz', 'Зелёный лук', 'Green onions', 'bog', 'food'], ['Ukrop', 'Укроп', 'Dill', 'bog', 'food'], ['Kinza', 'Кинза', 'Coriander', 'bog', 'food'],
  ['Petruşka', 'Петрушка', 'Parsley', 'bog', 'food'], ['Rayhon', 'Райхон', 'Basil', 'bog', 'food'], ['Jambil', 'Чабрец', 'Thyme', 'bog', 'food'],
  ['Kök (salat)', 'Салат листовой', 'Lettuce', 'bog', 'food'], ['Qöziqorin', 'Грибы', 'Mushrooms', 'kg', 'food'], ['Makkajöxori', 'Кукуруза', 'Corn', 'dona', 'food'],
  // mevalar
  ['Olma', 'Яблоки', 'Apples', 'kg', 'food'], ['Nok', 'Груши', 'Pears', 'kg', 'food'], ['Uzum', 'Виноград', 'Grapes', 'kg', 'food'],
  ['Banan', 'Бананы', 'Bananas', 'kg', 'food'], ['Apelsin', 'Апельсины', 'Oranges', 'kg', 'food'], ['Mandarin', 'Мандарины', 'Tangerines', 'kg', 'food'],
  ['Limon', 'Лимон', 'Lemons', 'kg', 'food'], ['Anor', 'Гранат', 'Pomegranates', 'kg', 'food'], ['Xurmo', 'Хурма', 'Persimmons', 'kg', 'food'],
  ['Qovun', 'Дыня', 'Melon', 'dona', 'food'], ['Tarvuz', 'Арбуз', 'Watermelon', 'dona', 'food'], ['Örik', 'Абрикосы', 'Apricots', 'kg', 'food'],
  ['Şaftoli', 'Персики', 'Peaches', 'kg', 'food'], ['Gilos', 'Черешня', 'Cherries', 'kg', 'food'], ['Qulupnay', 'Клубника', 'Strawberries', 'kg', 'food'],
  ['Kivi', 'Киви', 'Kiwi', 'kg', 'food'], ['Behi', 'Айва', 'Quince', 'kg', 'food'], ['Olxöri', 'Слива', 'Plums', 'kg', 'food'],
  // quruq mevalar, yongoq
  ['Mayiz', 'Изюм', 'Raisins', 'kg', 'food'], ['Quruq örik (turşak)', 'Курага', 'Dried apricots', 'kg', 'food'], ['Yongoq', 'Грецкий орех', 'Walnuts', 'kg', 'food'],
  ['Bodom', 'Миндаль', 'Almonds', 'kg', 'food'], ['Pista', 'Фисташки', 'Pistachios', 'kg', 'food'], ['Yeryongoq', 'Арахис', 'Peanuts', 'kg', 'food'],
  ['Kungaboqar pistasi', 'Семечки', 'Sunflower seeds', 'kg', 'food'], ['Xurmo (finik)', 'Финики', 'Dates', 'kg', 'food'],
  // göşt, baliq
  ['Mol göşti', 'Говядина', 'Beef', 'kg', 'food'], ['Qöy göşti', 'Баранина', 'Lamb', 'kg', 'food'], ['Tovuq', 'Курица', 'Chicken', 'kg', 'food'],
  ['Tovuq söni', 'Куриные окорочка', 'Chicken legs', 'kg', 'food'], ['Tovuq filesi', 'Куриное филе', 'Chicken breast', 'kg', 'food'], ['Qiyma', 'Фарш', 'Minced meat', 'kg', 'food'],
  ['Dumba yoği', 'Курдючный жир', 'Tail fat', 'kg', 'food'], ['Jigar', 'Печень', 'Liver', 'kg', 'food'], ['Baliq', 'Рыба', 'Fish', 'kg', 'food'],
  ['Kolbasa', 'Колбаса', 'Sausage', 'kg', 'food'], ['Sosiska', 'Сосиски', 'Hot dogs', 'paket', 'food'], ['Qazi', 'Казы', 'Qazi (horse sausage)', 'kg', 'food'],
  // sut mahsulotlari
  ['Sut', 'Молоко', 'Milk', 'l', 'food'], ['Qatiq', 'Катык', 'Yogurt (qatiq)', 'l', 'food'], ['Kefir', 'Кефир', 'Kefir', 'l', 'food'],
  ['Qaymoq', 'Каймак', 'Clotted cream', 'kg', 'food'], ['Smetana', 'Сметана', 'Sour cream', 'dona', 'food'], ['Suzma', 'Сузьма', 'Strained yogurt', 'kg', 'food'],
  ['Tvorog', 'Творог', 'Cottage cheese', 'kg', 'food'], ['Pişloq', 'Сыр', 'Cheese', 'kg', 'food'], ['Sariyoğ', 'Сливочное масло', 'Butter', 'dona', 'food'],
  ['Yogurt', 'Йогурт', 'Yogurt', 'dona', 'food'], ['Muzqaymoq', 'Мороженое', 'Ice cream', 'dona', 'food'], ['Tuxum', 'Яйца', 'Eggs', 'dona', 'food'],
  // non, un, yorma
  ['Non', 'Лепёшка', 'Bread (non)', 'dona', 'food'], ['Buxanka non', 'Хлеб', 'Loaf of bread', 'dona', 'food'], ['Un', 'Мука', 'Flour', 'kg', 'food'],
  ['Guruç', 'Рис', 'Rice', 'kg', 'food'], ['Devzira guruç', 'Рис девзира', 'Devzira rice', 'kg', 'food'], ['Grečka', 'Гречка', 'Buckwheat', 'kg', 'food'],
  ['Makaron', 'Макароны', 'Pasta', 'paket', 'food'], ['Vermişel', 'Вермишель', 'Vermicelli', 'paket', 'food'], ['Mosh', 'Маш', 'Mung beans', 'kg', 'food'],
  ['Nöxat', 'Нут', 'Chickpeas', 'kg', 'food'], ['Loviya', 'Фасоль', 'Beans', 'kg', 'food'], ['Yasmiq', 'Чечевица', 'Lentils', 'kg', 'food'],
  ['Arpa yormasi', 'Перловка', 'Pearl barley', 'kg', 'food'], ['Suli (gerkules)', 'Овсянка', 'Oats', 'paket', 'food'], ['Manka', 'Манка', 'Semolina', 'kg', 'food'],
  ['Lavaş', 'Лаваш', 'Lavash', 'dona', 'food'], ['Pečenye', 'Печенье', 'Cookies', 'paket', 'food'], ['Tort', 'Торт', 'Cake', 'dona', 'food'],
  // yoğ, ziravor, boşqa
  ['Paxta yoği', 'Хлопковое масло', 'Cottonseed oil', 'l', 'food'], ['Kungaboqar yoği', 'Подсолнечное масло', 'Sunflower oil', 'l', 'food'], ['Zaytun yoği', 'Оливковое масло', 'Olive oil', 'dona', 'food'],
  ['Şakar', 'Сахар', 'Sugar', 'kg', 'food'], ['Tuz', 'Соль', 'Salt', 'paket', 'food'], ['Qora murç', 'Чёрный перец', 'Black pepper', 'paket', 'food'],
  ['Zira', 'Зира', 'Cumin', 'paket', 'food'], ['Ziravorlar', 'Специи', 'Spices', 'paket', 'food'], ['Tomat pastasi', 'Томатная паста', 'Tomato paste', 'dona', 'food'],
  ['Mayonez', 'Майонез', 'Mayonnaise', 'dona', 'food'], ['Ketçup', 'Кетчуп', 'Ketchup', 'dona', 'food'], ['Sirka', 'Уксус', 'Vinegar', 'dona', 'food'],
  ['Asal', 'Мёд', 'Honey', 'kg', 'food'], ['Murabbo', 'Варенье', 'Jam', 'dona', 'food'], ['Şokolad', 'Шоколад', 'Chocolate', 'dona', 'food'],
  ['Konfet', 'Конфеты', 'Sweets', 'kg', 'food'], ['Qora çoy', 'Чёрный чай', 'Black tea', 'paket', 'food'], ['Kök çoy', 'Зелёный чай', 'Green tea', 'paket', 'food'],
  ['Qahva', 'Кофе', 'Coffee', 'dona', 'food'], ['Suv', 'Вода', 'Water', 'l', 'food'], ['Şarbat (sok)', 'Сок', 'Juice', 'l', 'food'],
  ['Gazli içimlik', 'Газировка', 'Soda', 'l', 'food'], ['Konserva', 'Консервы', 'Canned food', 'dona', 'food'], ['Muzlatilgan mahsulot', 'Заморозка', 'Frozen food', 'paket', 'food'],
  ['Pelmen', 'Пельмени', 'Dumplings', 'kg', 'food'], ['Ačitqi', 'Дрожжи', 'Yeast', 'paket', 'food'], ['Soda', 'Сода', 'Baking soda', 'paket', 'food'],
  // uy-röğğor
  ['Kir yuviş kukuni', 'Стиральный порошок', 'Laundry powder', 'paket', 'household'], ['Kir yuviş geli', 'Гель для стирки', 'Laundry gel', 'dona', 'household'],
  ['Idiş yuviş vositasi', 'Средство для посуды', 'Dish soap', 'dona', 'household'], ['Sovun', 'Мыло', 'Soap', 'dona', 'household'],
  ['Suyuq sovun', 'Жидкое мыло', 'Liquid soap', 'dona', 'household'], ['Hojatxona qoğozi', 'Туалетная бумага', 'Toilet paper', 'paket', 'household'],
  ['Salfetka', 'Салфетки', 'Napkins', 'paket', 'household'], ['Nam salfetka', 'Влажные салфетки', 'Wet wipes', 'paket', 'household'],
  ['Çiqindi paketi', 'Мусорные пакеты', 'Trash bags', 'paket', 'household'], ['Gubka', 'Губки', 'Sponges', 'paket', 'household'],
  ['Pol yuviş vositasi', 'Средство для пола', 'Floor cleaner', 'dona', 'household'], ['Oqartiruvçi (belizna)', 'Белизна', 'Bleach', 'dona', 'household'],
  ['Folga', 'Фольга', 'Foil', 'dona', 'household'], ['Gugurt', 'Спички', 'Matches', 'dona', 'household'], ['Lampoçka', 'Лампочка', 'Light bulb', 'dona', 'household'],
  ['Batareyka', 'Батарейки', 'Batteries', 'dona', 'household'],
  // şaxsiy gigiyena
  ['Şampun', 'Шампунь', 'Shampoo', 'dona', 'beauty'], ['Tiş pastasi', 'Зубная паста', 'Toothpaste', 'dona', 'beauty'], ['Tiş çötkasi', 'Зубная щётка', 'Toothbrush', 'dona', 'beauty'],
  ['Dezodorant', 'Дезодорант', 'Deodorant', 'dona', 'beauty'], ['Krem', 'Крем', 'Cream', 'dona', 'beauty'], ['Soqol olish ustarasi', 'Бритва', 'Razor', 'dona', 'beauty'],
  ['Gigiyenik prokladka', 'Прокладки', 'Pads', 'paket', 'beauty'],
  // bolalar
  ['Taglik (pampers)', 'Подгузники', 'Diapers', 'paket', 'kids'], ['Bolalar ovqati', 'Детское питание', 'Baby food', 'dona', 'kids'], ['Bolalar aralaşmasi', 'Детская смесь', 'Baby formula', 'dona', 'kids'],
  ['Öyinçoq', 'Игрушка', 'Toy', 'dona', 'kids'], ['Daftar', 'Тетради', 'Notebooks', 'dona', 'edu'], ['Ruçka', 'Ручки', 'Pens', 'dona', 'edu'],
  // dorixona
  ['Paratsetamol', 'Парацетамол', 'Paracetamol', 'paket', 'health'], ['Vitaminlar', 'Витамины', 'Vitamins', 'paket', 'health'], ['Plastir', 'Пластырь', 'Plasters', 'paket', 'health'],
  ['Bint', 'Бинт', 'Bandage', 'dona', 'health'], ['Termometr', 'Термометр', 'Thermometer', 'dona', 'health'], ['Burun tomçisi', 'Капли для носа', 'Nose drops', 'dona', 'health'],
  // boşqa
  ['Mol uçun yem', 'Корм', 'Animal feed', 'kg', 'other'], ['Gul', 'Цветы', 'Flowers', 'dona', 'gifts'],
];
