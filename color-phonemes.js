/**
*
* @source: https://english.fromatogra.com/color-phonemes.js
*
* @licstart  The following is the entire license notice for the 
*  JavaScript code in this page.
*
* Copyright (C) 2016-2018 Marc Flerackers
*
*
* The JavaScript code in this page is free software: you can
* redistribute it and/or modify it under the terms of the GNU
* General Public License (GNU GPL) as published by the Free Software
* Foundation, either version 3 of the License, or (at your option)
* any later version.  The code is distributed WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
*
* As additional permission under GNU GPL version 3 section 7, you
* may distribute non-source (e.g., minimized or compacted) forms of
* that code without the copy of the GNU GPL normally required by
* section 4, provided you include this license notice and a URL
* through which recipients can access the Corresponding Source.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this page.
*
*/

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

// Dynamic programming algorithm to match phonemes with graphemes
class MatchCandidate {
    constructor(remaining, phonemes, graphemes, score) {
        this.remaining = remaining;
        this.phonemes = phonemes || [];
        this.graphemes = graphemes || [];
        this._score = score || 0;
    }
    extend(phoneme, grapheme) {
        let remaining = this.remaining.substring(grapheme.length)
        var phonemes = this.phonemes.slice()
        var graphemes = this.graphemes.slice()
        var score = this._score
        
        phonemes.push(phoneme)
        graphemes.push(grapheme)
        
        if (phoneme == "silent") {
            score = score - 2; // Silent grapheme
        } else {
            score = score + grapheme.length;
        }
        score = score / this.remaining.length

        console.log(remaining, phonemes, graphemes, score);
        
        return new MatchCandidate(remaining, phonemes, graphemes, score)
    }
    match() {
        var match = [];
        for (let i = 0; i < this.phonemes.length; i++) {
            match.push({ph:this.phonemes[i], ch:this.graphemes[i]});
        }
        // Silent
        if (this.remaining.length > 0) {
            match.push({ph:"silent", ch:this.remaining});
            console.log("Chosen candidate " + this.graphemes + "," + this.remaining + " for " + this.phonemes + ",silent");
        }
        else {
            console.log("Chosen candidate " + this.graphemes + " for " + this.phonemes);
        }
        
        return match;
    }
    score() {
        console.log(this.remaining)
        return this._score + (this.remaining.length ? -2 : 0);
    }
}

letters = {
    AA : ["e", "o", "au", "aw", "ou", "a"],
    AE : ["au", "a"],
    AH : ["ou", "ui", "u", "a", "e", "o", "oo", "io", "i", "y", "h"],
    AO : ["oa", "al", "au", "aw", "ou", "oo", "o", "a"],
    AW : ["ou", "ow"],
    AY : ["a", "ai", "ie", "ui", "uy", "ey", "i", "oi", "oy", "y"],
    B  : ["bb", "b"],
    CH : ["ch", "c", "tch", "t"],
    D  : ["dd", "d"],
    DH : ["th", "t"],
    EH : ["ea", "e", "ei", "ai", "a"],
    ER : ["ar", "ear", "er", "ir", "oar", "or", "rr", "r", "irr", "ur"],
    EY : ["ay", "ai", "a", "ei", "ey", "e"],
    G  : ["gg", "g"],
    F  : ["ff", "f", "ph", "gh"],
    HH : ["h"],
    IH : ["a", "ee", "e", "ui", "u", "ie", "i", "o", "y"],
    IU : ["eau", "ew", "iew", "ue", "u", "you"],
    IY : ["a", "i", "y", "ee", "ea", "e", "ui", "u", "y"],
    JH : ["d", "dg", "ge", "g", "j", "s"],
    K  : ["ck", "c", "g", "k", "q"],
    KW : ["ch", "cu", "qu"],
    L  : ["ll", "l", "l"],
    M  : ["mm", "m"],
    N  : ["nn", "n"],
    NG : ["ng", "n"],
    OW : ["ew", "oa", "ou", "ow", "oe", "oi", "o"],
    OY : ["oi", "oy"],
    P  : ["pp", "p"],
    R  : ["rr", "r"],
    S  : ["c", "sc", "ss", "s"],
    SH : ["ch", "ci", "c", "sh", "si", "s", "ti"],
    T  : ["d", "tt", "t"],
    TH : ["th"],
    UH : ["a", "e", "i", "ia", "oo", "ou", "o", "u"],
    UL : ["al", "all", "il", "l", "ol", "ull", "ul"],
    UW : ["eu", "ew", "oo", "ou", "o", "u", "ue", "ui"],
    V  : ["v", "v", "f"],
    W  : ["u", "w"],
    X  : ["x", "cs", "kes", "ks"],
    Z  : ["x", "zz", "z", "s"],
    ZH : ["g", "s", "su"]
};

silents = ["c", "ew", "e", "gh", "g", "h", "k", "w", "p", "s", "t", "b", "l", "n", "o", "ou", "i", "d", "z", "ch", "w", "u"];

function getSilents(graphemes) {
    //console.log("looking for silent in " + graphemes);
    return silents.filter(silent => graphemes.startsWith(silent));
}

function transformPhonemes(phonemes) {
    console.log("pre-transform", phonemes);
    newPhonemes = [];
    let prev = null
    for (phoneme of phonemes) {
        switch (prev) {
            case "Y": {
                prev = null
                if (phoneme == "UW") {
                    newPhonemes.push("IU");
                    continue;
                } else {
                    newPhonemes.push("IY");
                }
                break;
            }
            case "K": {
                prev = null;
                if (phoneme == "S") {
                    newPhonemes.push("X");
                    continue;
                } 
                else if (phoneme == "W") {
                    newPhonemes.push("KW");
                    continue;
                }
                else {
                    newPhonemes.push("K");
                    break;
                }
            }
            case "AH": {
                prev = null;
                if (phoneme == "L") {
                    newPhonemes.push("UL");
                    continue;
                } else {
                    newPhonemes.push("AH");
                    break;
                }
                continue;
            }
            case null:
            break;
            default:
            assert(false, "Unhandled prev " + prev);
        }
        switch (phoneme) {
            case "Y":
            case "K":
            case "AH":
            prev = phoneme;
            continue;
        }
        newPhonemes.push(phoneme);
    }
    if (prev) {
        newPhonemes.push(prev);
    }
    console.log("post-transform", newPhonemes);
    return newPhonemes;
}

function matchPhonemes(word, phonemes) {
    var candidates = [new MatchCandidate(word)];
    for (phoneme of phonemes) {
        //console.log(phoneme);
        let graphemes = letters[phoneme];
        assert(graphemes, "No graphemes found for " + phoneme + " in " + phonemes);
        var newCandidates = [];
        for (let grapheme of graphemes) {
            //console.log("current grapheme match : ", grapheme);
            for (let candidate of candidates) {
                //console.log("current candidate match: ", candidate);
                if (candidate.remaining.toLowerCase().startsWith(grapheme)) {
                    //console.log("added " + grapheme + " for " + phoneme);
                    newCandidates.push(candidate.extend(phoneme, candidate.remaining.slice(0, grapheme.length)));
                }
                else {
                    //console.log("grapheme " + grapheme + " for " + phoneme + " not in " + candidate.remaining);
                }
                // Only match silents within a word
                //if (candidate.remaining.length < word.length) {
                    let silents = getSilents(candidate.remaining.toLowerCase());
                    //console.log("got silents ", silents);
                    silents.forEach(silent => {
                        if (candidate.remaining.indexOf(grapheme) == silent.length) {
                            //console.log("added silent " + silent + " before " + grapheme)
                            let silentCandidate = candidate.extend("silent", silent);
                            newCandidates.push(silentCandidate.extend(phoneme, grapheme));
                        }
                        else {
                            //console.log("no silent match for " + silent + " and " + grapheme);
                        }
                    });
                //}
                //else {
                //    //console.log("not trying silent letters");
                //}
            }
        }
        candidates = newCandidates;
    }
    assert(candidates.length > 0, "No candidates to match " + word + " with " + phonemes);
    let candidate = candidates.reduce(function(a, b) {
        return a.score() > b.score() ? a : b;
    });
    return candidate.match()
}

if (exports) {
    exports.transformPhonemes = transformPhonemes;
    exports.matchPhonemes = matchPhonemes;
}
