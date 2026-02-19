export interface CareTipSection {
    title: string;
    content: string;
}

export interface CareTip {
    id: number;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    readTime: string;
    sections: CareTipSection[];
}

export const careTips: CareTip[] = [
    {
        id: 1,
        title: "How to not kill your Succulent",
        category: "Educational",
        description:
            "Most succulents die from over-watering. Discover the perfect drainage balance and light cycles to keep your succulents thriving year-round.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        readTime: "5 min read",
        sections: [
            {
                title: "The Golden Rule: Ignore It",
                content: "Succulents purely thrive on neglect. The most common way to kill a succulent is by loving it too much—specifically, with water. These plants are built to store water in their fleshy leaves, stems, or roots, allowing them to survive in arid environments. When you water them too frequently, their roots sit in damp soil and rot. Only water when the soil is bone dry. If you're unsure, wait another week.",
            },
            {
                title: "Sunlight is Key",
                content: "While they are tough, succulents need light. Most varieties prefer at least 6 hours of indirect, bright sunlight a day. If your succulent starts to look stretched out or 'leggy', it's reaching for light. Move it to a sunnier spot, like a south-facing window, but be careful of scorching midday sun if it's not acclimated.",
            },
            {
                title: "Soil and Drainage",
                content: "Regular potting soil acts like a sponge, holding onto moisture for too long. Succulents need specific cactus or succulent mix that drains rapidly. Ensure your pot has drainage holes at the bottom. If you use a decorative pot without holes, keep the plant in its plastic nursery pot and remove it to water, letting it drain completely before putting it back.",
            },
        ],
    },
    {
        id: 2,
        title: "The Art of Vase Arrangement",
        category: "Lifestyle",
        description:
            "Matching the shape of your vase to your floral stems is an art form. Learn the rules of proportions and color harmony for stunning arrangements.",
        imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
        readTime: "7 min read",
        sections: [
            {
                title: "Choose the Right Vessel",
                content: "The vase dictates the shape of your arrangement. Tall, cylindrical vases support long-stemmed flowers like lilies or gladiolus. Round, bowl-shaped vases are perfect for shorter, fuller blooms like hydrangeas or peonies. A good rule of thumb is that the vase should make up one-third to one-half of the total height of the arrangement.",
            },
            {
                title: "Build a Foundation with Foliage",
                content: "Start by creating a grid with your greenery. Criss-cross the stems of foliage to create a natural structure that will hold your flowers in place. This base allows you to insert blooms securely and adds depth and texture to the final look.",
            },
            {
                title: "Layering and Flow",
                content: "Add your largest 'focal' flowers first, placing them at different heights and angles. Then fill in the gaps with smaller accent flowers. Finish with wispy, delicate stems that extend beyond the main shape to give the arrangement movement and a natural, airy feel.",
            },
        ],
    },
    {
        id: 3,
        title: "Indoor Plant Lighting Guide",
        category: "Educational",
        description:
            "Understanding light requirements is crucial for indoor plants. Learn how to identify low, medium, and bright light areas in your home.",
        imageUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
        readTime: "6 min read",
        sections: [
            {
                title: "Decoding 'Bright Indirect Light'",
                content: "This is the most common requirement but often misunderstood. It means your plant has a wide view of the sky but the sun's rays don't hit the leaves directly. Think of the light just next to a sunny window, or behind a sheer curtain. This mimics the dappled light of a forest canopy.",
            },
            {
                title: "Low Light vs. No Light",
                content: "Low light doesn't mean a dark closet. It means a spot away from windows or in a north-facing room. Plants like Snake Plants and ZZ Plants can tolerate this, but they will grow much slower. All plants need some light to photosynthesize, so a windowless bathroom isn't viable long-term without grow lights.",
            },
            {
                title: "Direct Sun Lovers",
                content: "South or West-facing windows provide intense, direct light. Cacti, succulents, and some tropicals like the Bird of Paradise thrive here. Be cautious with other plants; direct noon sun can sunburn leaves, causing bleached or brown crispy spots.",
            },
        ],
    },
    {
        id: 4,
        title: "Watering Schedule for Common Houseplants",
        category: "Educational",
        description:
            "Create a watering schedule that works. Different plants have different needs - learn when and how much to water your indoor garden.",
        imageUrl: "https://images.unsplash.com/photo-1597848212624-e593b98b8c2b?w=400",
        readTime: "8 min read",
        sections: [
            {
                title: "The Finger Test",
                content: "The best tool you have is your finger. Insert it about two inches into the soil. If it feels dry, it's time to water. If it's damp, wait. Stick to this manual check rather than a strict calendar schedule, as environmental factors like humidity and temperature change how fast soil dries out.",
            },
            {
                title: "Watering Techniques",
                content: "When you water, do it thoroughly. Pour water until it flows freely out of the drainage holes. This ensures deep roots get moisture and flushes out salt buildup. Alternatively, 'bottom water' by placing the pot in a bowl of water for 20 minutes, allowing the soil to soak up moisture from the bottom up.",
            },
            {
                title: "Signs of Trouble",
                content: "Yellowing leaves can mean overwatering (if they are soft/mushy) or underwatering (if they are dry/crispy). Wilting can also be a sign of both, so always check the soil moisture before acting. Consistent watering is better than a flood-drought cycle.",
            },
        ],
    },
    {
        id: 5,
        title: "Pet-Safe Plants for Your Home",
        category: "Safety",
        description:
            "Keep your furry friends safe while enjoying greenery. Discover which plants are non-toxic and which to avoid if you have pets.",
        imageUrl: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400",
        readTime: "10 min read",
        sections: [
            {
                title: "Toxic Plants to Avoid",
                content: "Some popular houseplants are dangerous to cats and dogs. Lilies are extremely toxic to cats (causing kidney failure from just pollen). Pothos, Philodendrons, and Monsteras contain calcium oxalate crystals that irritate the mouth and throat if chewed, causing drooling and vomiting.",
            },
            {
                title: "Safe and Beautiful Alternatives",
                content: "You don't have to sacrifice style for safety. Calatheas, Prayer Plants, Spider Plants, and Boston Ferns are completely non-toxic. The Parlor Palm and Ponytail Palm are also excellent pet-friendly structural plants that add height and drama without the risk.",
            },
            {
                title: "Deterring Curiosity",
                content: "Even non-toxic plants can be damaged by a playful pet. Place plants on high shelves or in hanging planters to keep them out of reach. Some pet owners find that placing citrus peels or using a bitter apple spray on the pot (not the plant) can help deter digging.",
            },
        ],
    },
    {
        id: 6,
        title: "Seasonal Plant Care Calendar",
        category: "Educational",
        description:
            "Your plants' needs change with the seasons. Follow this month-by-month guide to keep your plants healthy throughout the year.",
        imageUrl: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400",
        readTime: "12 min read",
        sections: [
            {
                title: "Spring: Waking Up",
                content: "As days get longer, plants enter their active growing season. Inspect for pests that may have overwintered. This is the best time to repot if your plant has outgrown its container. Resume fertilizing with a diluted balanced fertilizer to support new growth.",
            },
            {
                title: "Summer: Peak Growth",
                content: "Watering frequency will likely increase with the heat. Monitor plants near windows to ensure the intense summer sun isn't scorching them. If you move plants outdoors, do it gradually to acclimatize them. Rotate pots regularly for even growth.",
            },
            {
                title: "Fall and Winter: Dormancy",
                content: "Growth slows down. Stop fertilizing. Reduce watering significantly—plants dry out much slower in cooler temperatures (except in homes with very dry heating, where you might need a humidifier). Move plants closer to windows to maximize the limited daylight.",
            },
        ],
    },
];
