RiTa = require("./rita-full.min.js");
let c = require("./color-phonemes.js");

function doTransform(word) {
    let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-");
    //console.log(phonemes)
    //console.log(c.transformPhonemes(phonemes))
    return c.transformPhonemes(phonemes);
}

function doMatch(word) {
    let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-");
    phonemes = c.transformPhonemes(phonemes);
    //console.log(phonemes)
    return c.matchPhonemes(word, phonemes);
}

describe("Basic tests", function() {
    it("Capital letters are OK", function() {
        expect(doTransform("Apple")).toEqual([ "AE", "P", "UL" ]);
    });
    it("Only capital letters are OK", function() {
        expect(doTransform("APPLE")).toEqual([ "AE", "P", "UL" ]);
    });
});

describe("Transform tests", function() {
    it("apple", function() {
        expect(doTransform("apple")).toEqual([ "AE", "P", "UL" ]);
    });
    it("causality", function() {
        expect(doTransform("causality")).toEqual([ 'K', 'AO', 'Z', 'AE', 'L', 'AH', 'T', 'IY' ]);
    });
    it("motorcycle", function() {
        expect(doTransform("motorcycle")).toEqual([ "M", "OW", "T", "ER", "S", "AY", "K", "UL" ]);
    });
    it("politician", function() {
        expect(doTransform("politician")).toEqual([ "P", "AA", "L", "AH", "T", "IH", "SH", "AH", "N" ]);
    });
    it("palindrome", function() {
        expect(doTransform("palindrome")).toEqual([ "P", "AE", "L", "IH", "N", "D", "R", "OW", "M" ]);
    });
    it("superficial", function() {
        expect(doTransform("superficial")).toEqual([ "S", "UW", "P", "ER", "F", "IH", "SH", "UL" ]);
    });
    it("postulate", function() {
        expect(doTransform("postulate")).toEqual([ "P", "AA", "S", "CH", "UL", "EY", "T" ]);
    });
    it("southern", function() {
        expect(doTransform("southern")).toEqual([ "S", "AH", "DH", "ER", "N" ]);
    });
    it("alphabet", function() {
        expect(doTransform("alphabet")).toEqual([ "AE", "L", "F", "AH", "B", "EH", "T" ]);
    });
    it("psychotic", function() {
        expect(doTransform("psychotic")).toEqual([ "S", "AY", "K", "AA", "T", "IH", "K" ]);
    });
    it("psychiatrist", function() {
        expect(doTransform("psychiatrist")).toEqual([ "S", "AH", "K", "AY", "AH", "T", "R", "AH", "S", "T" ]);
    });
    it("pseudonym", function() {
        expect(doTransform("pseudonym")).toEqual([ "S", "UW", "D", "AH", "N", "IH", "M" ]);
    });
    it("confusion", function() {
        expect(doTransform("confusion")).toEqual([ "K", "AH", "N", "F", "IU", "ZH", "AH", "N" ]);
    });
    it("aisle", function() {
        expect(doTransform("aisle")).toEqual([ "AY", "L" ]);
    });
    it("science", function() {
        expect(doTransform("science")).toEqual([ "S", "AY", "AH", "N", "S" ]);
    });
    it("dew", function() {
        expect(doTransform("dew")).toEqual([ "D", "UW" ]);
    });
    it("garbage", function() {
        expect(doTransform("garbage")).toEqual([ "G", "AA", "R", "B", "IH", "JH" ]);
    });
    it("sew", function() {
        expect(doTransform("sew")).toEqual([ "S", "OW" ]);
    });
    it("few", function() {
        expect(doTransform("few")).toEqual([ "F", "IU" ]);
    });
    it("quiche", function() {
        expect(doTransform("quiche")).toEqual([ "K", "IY", "SH" ]);
    });
    it("squirrel", function() {
        expect(doTransform("squirrel")).toEqual([ "S", "KW", "ER", "UL" ]);
    });
    it("fetch", function() {
        expect(doTransform("fetch")).toEqual([ "F", "EH", "CH" ]);
    });
    it("karaoke", function() {
        expect(doTransform("karaoke")).toEqual([ "K", "EH", "R", "IY", "OW", "K", "IY" ]);
    });
    it("surprise", function() {
        expect(doTransform("surprise")).toEqual([ "S", "ER", "P", "R", "AY", "Z" ]);
    });
    it("happily", function() {
        expect(doTransform("happily")).toEqual([ "HH", "AE", "P", "UL", "IY" ]);
    });
    it("their", function() {
        expect(doTransform("their")).toEqual([ "DH", "EH", "R" ]);
    });
    it("sure", function() {
        expect(doTransform("sure")).toEqual([ "SH", "UH", "R" ]);
    });
    it("walk", function() {
        expect(doTransform("walk")).toEqual([ "W", "AO", "K" ]);
    });
    it("choir", function() {
        expect(doTransform("choir")).toEqual([ "KW", "AY", "ER" ]);
    });
    it("coyote", function() {
        expect(doTransform("coyote")).toEqual([ "K", "AY", "OW", "T", "IY" ]);
    });
    it("rhythm", function() {
        expect(doTransform("rhythm")).toEqual([ "R", "IH", "DH", "AH", "M" ]);
    });
    it("suit", function() {
        expect(doTransform("suit")).toEqual([ "S", "UW", "T" ]);
    });
    it("figure", function() {
        expect(doTransform("figure")).toEqual([ "F", "IH", "G", "IY", "ER" ]);
    });
    it("climber", function() {
        expect(doTransform("climber")).toEqual([ "K", "L", "AY", "M", "ER" ]);
    });
    it("massage", function() {
        expect(doTransform("massage")).toEqual([ "M", "AH", "S", "AA", "ZH" ]);
    });
    it("women", function() {
        expect(doTransform("women")).toEqual([ "W", "IH", "M", "EH", "N" ]);
    });
    it("ancient", function() {
        expect(doTransform("ancient")).toEqual([ "EY", "N", "CH", "AH", "N", "T" ]);
    });
    it("length", function() {
        expect(doTransform("length")).toEqual([ "L", "EH", "NG", "K", "TH"]);
    });
});

describe("Match tests", function() {
    it("apple", function() {
        expect(doMatch("apple")).toBeTruthy();
    });
    it("causality", function() {
        expect(doMatch("causality")).toBeTruthy();
    });
    it("motorcycle", function() {
        expect(doMatch("motorcycle")).toBeTruthy();
    });
    it("politician", function() {
        expect(doMatch("politician")).toBeTruthy();
    });
    it("palindrome", function() {
        expect(doMatch("palindrome")).toBeTruthy();
    });
    it("superficial", function() {
        expect(doMatch("superficial")).toBeTruthy();
    });
    it("postulate", function() {
        expect(doMatch("postulate")).toBeTruthy();
    });
    it("southern", function() {
        expect(doMatch("southern")).toBeTruthy();
    });
    it("alphabet", function() {
        expect(doMatch("alphabet")).toBeTruthy();
    });
    it("psychotic", function() {
        expect(doMatch("psychotic")).toBeTruthy();
    });
    it("psychiatrist", function() {
        expect(doMatch("psychiatrist")).toBeTruthy();
    });
    it("pseudonym", function() {
        expect(doMatch("pseudonym")).toBeTruthy();
    });
    it("confusion", function() {
        expect(doMatch("confusion")).toBeTruthy();
    });
    it("aisle", function() {
        expect(doMatch("aisle")).toBeTruthy();
    });
    it("science", function() {
        expect(doMatch("science")).toBeTruthy();
    });
    it("dew", function() {
        expect(doMatch("dew")).toBeTruthy();
    });
    it("garbage", function() {
        expect(doMatch("garbage")).toBeTruthy();
    });
    it("sew", function() {
        expect(doMatch("sew")).toBeTruthy();
    });
    it("few", function() {
        expect(doMatch("few")).toBeTruthy();
    });
    it("quiche", function() {
        expect(doMatch("quiche")).toBeTruthy();
    });
    it("squirrel", function() {
        expect(doMatch("squirrel")).toBeTruthy();
    });
    it("fetch", function() {
        expect(doMatch("fetch")).toBeTruthy();
    });
    it("karaoke", function() {
        expect(doMatch("karaoke")).toBeTruthy();
    });
    it("surprise", function() {
        expect(doMatch("surprise")).toBeTruthy();
    });
    it("happily", function() {
        expect(doMatch("happily")).toBeTruthy();
    });
    it("their", function() {
        expect(doMatch("their")).toBeTruthy();
    });
    it("sure", function() {
        expect(doMatch("sure")).toBeTruthy();
    });
    it("walk", function() {
        expect(doMatch("walk")).toBeTruthy();
    });
    it("choir", function() {
        expect(doMatch("choir")).toBeTruthy();
    });
    it("coyote", function() {
        expect(doMatch("coyote")).toBeTruthy();
    });
    it("rhythm", function() {
        expect(doMatch("rhythm")).toBeTruthy();
    });
    it("suit", function() {
        expect(doMatch("suit")).toBeTruthy();
    });
    it("figure", function() {
        expect(doMatch("figure")).toBeTruthy();
    });
    it("climber", function() {
        expect(doMatch("climber")).toBeTruthy();
    });
    it("massage", function() {
        expect(doMatch("massage")).toBeTruthy();
    });
    it("women", function() {
        expect(doMatch("women")).toBeTruthy();
    });
    it("ancient", function() {
        expect(doMatch("ancient")).toBeTruthy();
    });
    it("length", function() {
        expect(doMatch("length")).toBeTruthy();
    });
});