"use strict";
let data = {
    genus: [
        { id: 1, description: "Bulbophyllum" },
        { id: 2, description: "Cattleya" },
        { id: 3, description: "Cymbidium" },
        { id: 4, description: "Paphiopedilum" },
        { id: 5, description: "Phalaenopsis" }
    ],
    type: [
        { id: 1, description: "Espécie" },
        { id: 2, description: "Híbrido" }
    ],
    luminosity: [
        { id: 1, description: "Sombra total" },
        { id: 2, description: "Luz sombreada" },
        { id: 3, description: "Luz filtrada" },
        { id: 4, description: "Luz forte" }
    ],
    temperature: [
        { id: 1, description: "Frio" },
        { id: 2, description: "Temperado" },
        { id: 3, description: "Quente" },
        { id: 4, description: "Muito quente" }
    ],
    humidity: [
        { id: 1, description: "\u226440%" },
        { id: 2, description: "40% a 60%" },
        { id: 3, description: "60% a 80%" },
        { id: 4, description: "\u226580%" }
    ],
    size: [
        { id: 1, description: "Miniatura" },
        { id: 2, description: "Pequeno" },
        { id: 3, description: "Médio" },
        { id: 4, description: "Grande" }
    ],
    orchid: [
        {
            id: 1,
            description: "Bulbophyllum eberhardtii",
            genus: 1,
            type: 1,
            luminosity: 3,
            temperature: 4,
            humidity: 3,
            size: 4,
            src: "/www/images/orchids/bulbophyllum/bulbophyllum-eberhardtii.jpg"
        },
        {
            id: 2,
            description: "Bulbophyllum echinolabium",
            genus: 1,
            type: 1,
            luminosity: 3,
            temperature: 3,
            humidity: 4,
            size: 4,
            src: "/www/images/orchids/bulbophyllum/bulbophyllum-echinolabium.jpg"
        },
        {
            id: 3,
            description: "Bulbophyllum frostii",
            genus: 1,
            type: 1,
            luminosity: 2,
            temperature: 3,
            humidity: 3,
            size: 1,
            src: "/www/images/orchids/bulbophyllum/bulbophyllum-frostii.jpg"
        },
        {
            id: 4,
            description: "Bulbophyllum Louis Sander",
            genus: 1,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 4,
            size: 2,
            src: "/www/images/orchids/bulbophyllum/bulbophyllum-louis-sander.jpg"
        },
        {
            id: 5,
            description: "Bulbophyllum mastersianum",
            genus: 1,
            type: 1,
            luminosity: 1,
            temperature: 2,
            humidity: 3,
            size: 2,
            src: "/www/images/orchids/bulbophyllum/bulbophyllum-mastersianum.jpg"
        },
        {
            id: 6,
            description: "Cattleya Crystelle Smith",
            genus: 2,
            type: 2,
            luminosity: 3,
            temperature: 3,
            humidity: 2,
            size: 2,
            src: "/www/images/orchids/cattleya/cattleya-crystelle-smith.jpg"
        },
        {
            id: 7,
            description: "Cattleya Husky Boy",
            genus: 2,
            type: 2,
            luminosity: 4,
            temperature: 3,
            humidity: 2,
            size: 3,
            src: "/www/images/orchids/cattleya/cattleya-husky-boy.jpg"
        },
        {
            id: 8,
            description: "Cattleya labiata",
            genus: 2,
            type: 1,
            luminosity: 4,
            temperature: 3,
            humidity: 2,
            size: 3,
            src: "/www/images/orchids/cattleya/cattleya-labiata.jpg"
        },
        {
            id: 9,
            description: "Cattleya Ports of Paradise",
            genus: 2,
            type: 2,
            luminosity: 4,
            temperature: 3,
            humidity: 2,
            size: 4,
            src: "/www/images/orchids/cattleya/cattleya-ports-of-paradise.jpg"
        },
        {
            id: 10,
            description: "Cattleya tigrina",
            genus: 2,
            type: 1,
            luminosity: 3,
            temperature: 3,
            humidity: 2,
            size: 4,
            src: "/www/images/orchids/cattleya/cattleya-tigrina.jpg"
        },
        {
            id: 11,
            description: "Cymbidium Aiko Sama",
            genus: 3,
            type: 2,
            luminosity: 4,
            temperature: 2,
            humidity: 1,
            size: 4,
            src: "/www/images/orchids/cymbidium/cymbidium-aiko-sama.jpg"
        },
        {
            id: 12,
            description: "Cymbidium Gold Cadillac",
            genus: 3,
            type: 2,
            luminosity: 4,
            temperature: 2,
            humidity: 1,
            size: 4,
            src: "/www/images/orchids/cymbidium/cymbidium-gold-cadillac.jpg"
        },
        {
            id: 13,
            description: "Cymbidium Peter Pan",
            genus: 3,
            type: 2,
            luminosity: 4,
            temperature: 2,
            humidity: 1,
            size: 4,
            src: "/www/images/orchids/cymbidium/cymbidium-peter-pan.jpg"
        },
        {
            id: 14,
            description: "Cymbidium Red Beauty",
            genus: 3,
            type: 2,
            luminosity: 4,
            temperature: 2,
            humidity: 1,
            size: 4,
            src: "/www/images/orchids/cymbidium/cymbidium-red-beauty.jpg"
        },
        {
            id: 15,
            description: "Cymbidium Vogel Magic",
            genus: 3,
            type: 2,
            luminosity: 4,
            temperature: 2,
            humidity: 1,
            size: 4,
            src: "/www/images/orchids/cymbidium/cymbidium-vogel-magic.jpg"
        },
        {
            id: 16,
            description: "Paphiopedilum Americano",
            genus: 4,
            type: 2,
            luminosity: 3,
            temperature: 3,
            humidity: 2,
            size: 3,
            src: "/www/images/orchids/paphiopedilum/paphiopedilum-americano.jpg"
        },
        {
            id: 17,
            description: "Paphiopedilum leucochilum",
            genus: 4,
            type: 1,
            luminosity: 2,
            temperature: 2,
            humidity: 4,
            size: 2,
            src: "/www/images/orchids/paphiopedilum/paphiopedilum-leucochilum.jpg"
        },
        {
            id: 18,
            description: "Paphiopedilum Maudiae Femma",
            genus: 4,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 4,
            size: 3,
            src: "/www/images/orchids/paphiopedilum/paphiopedilum-maudiae-femma.jpg"
        },
        {
            id: 19,
            description: "Paphiopedilum Montagnard",
            genus: 4,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 4,
            size: 3,
            src: "/www/images/orchids/paphiopedilum/paphiopedilum-montagnard.jpg"
        },
        {
            id: 20,
            description: "Paphiopedilum spicerianum",
            genus: 4,
            type: 1,
            luminosity: 1,
            temperature: 2,
            humidity: 4,
            size: 2,
            src: "/www/images/orchids/paphiopedilum/paphiopedilum-spicerianum.jpg"
        },
        {
            id: 21,
            description: "Phalaenopsis Black Pearl",
            genus: 5,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 3,
            size: 2,
            src: "/www/images/orchids/phalaenopsis/phalaenopsis-black-pearl.jpg"
        },
        {
            id: 22,
            description: "Phalaenopsis Liodoro",
            genus: 5,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 3,
            size: 3,
            src: "/www/images/orchids/phalaenopsis/phalaenopsis-liodoro.jpg"
        },
        {
            id: 23,
            description: "Phalaenopsis Manhattan Rose",
            genus: 5,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 3,
            size: 4,
            src: "/www/images/orchids/phalaenopsis/phalaenopsis-manhattan-rose.jpg"
        },
        {
            id: 24,
            description: "Phalaenopsis Spoted Harlequin",
            genus: 5,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 3,
            size: 3,
            src: "/www/images/orchids/phalaenopsis/phalaenopsis-spoted-harlequin.jpg"
        },
        {
            id: 25,
            description: "Phalaenopsis Talin Gold",
            genus: 5,
            type: 2,
            luminosity: 2,
            temperature: 2,
            humidity: 3,
            size: 3,
            src: "/www/images/orchids/phalaenopsis/phalaenopsis-talin-gold.jpg"
        }
    ]
};
