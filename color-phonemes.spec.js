RiTa = require("./rita-full.min.js");
let c = require("./color-phonemes.js");

function doTransform(word) {
    let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-");
    return c.transformPhonemes(phonemes);
}

function doMatch(word) {
    let phonemes = RiTa.getPhonemes(word).toUpperCase().split("-");
    phonemes = c.transformPhonemes(phonemes);
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
        expect(doTransform("causality")).toEqual([ "K", "AO", "Z", "AE", "L", "UH", "T", "IY" ]);
    });
    it("motorcycle", function() {
        expect(doTransform("motorcycle")).toEqual([ "M", "OW", "T", "ER", "S", "AY", "K", "UL" ]);
    });
    it("politician", function() {
        expect(doTransform("politician")).toEqual([ "P", "AA", "L", "UH", "T", "IH", "SH", "UH", "N" ]);
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
        expect(doTransform("southern")).toEqual([ "S", "UH", "DH", "ER", "N" ]);
    });
    it("alphabet", function() {
        expect(doTransform("alphabet")).toEqual([ "AE", "L", "F", "UH", "B", "EH", "T" ]);
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
  });