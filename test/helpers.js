"use strict";

var BASE_URL = location.protocol + "//" + location.host;

var expect = require("expect.js");
var helpers = require("../lib/helpers.js");

describe("helpers", function() {

    describe("createBlob", function() {

        it("is able to create a blob from given params", function() {
            var buffer = new Buffer(42);
            var blob = helpers.createBlob([buffer.toArrayBuffer()], {type: "application/octet-stream"});
            expect(blob).to.be.a(Blob);
            expect(blob.type).to.equal("application/octet-stream");
            expect(blob.size).to.equal(42);
        });

    });

    describe("httpGet", function() {

        it("can download an image as Buffer", function() {
            return helpers.httpGet(BASE_URL + "/files/image.png")
                .then(function(response) {
                    expect(response.mime).to.equal("image/png");
                    expect(response.buffer instanceof Buffer || response.buffer instanceof Uint8Array).to.be.ok();
                    expect(response.buffer.length).to.equal(816);
                });
        });

        it("can download a project as Buffer", function() {
            return helpers.httpGet(BASE_URL + "/files/project.wprj")
                .then(function(response) {
                    expect(response.mime).to.equal("application/octet-stream");
                    expect(response.buffer instanceof Buffer || response.buffer instanceof Uint8Array).to.be.ok();
                    expect(response.buffer.length).to.equal(147);
                });
        });

        it("returns an error if the resource type is not allowed", function() {
            return helpers.httpGet(BASE_URL + "/files/test.txt")
                .then(function(response) {
                    throw new Error("ShouldNotSucceed");
                })
                .catch(function(error) {
                    expect(error.toString()).to.match(/HttpStatus415/);
                });
        });

        it("returns an error if the resource does not exists", function() {
            return helpers.httpGet(BASE_URL + "/files/foobar")
                .then(function(response) {
                    throw new Error("ShouldNotSucceed");
                })
                .catch(function(error) {
                    expect(error.toString()).to.match(/HttpStatus404/);
                });
        });

        it("returns an error if the URL is not valide", function() {
            return helpers.httpGet("foobar/baz")
                .then(function(response) {
                    throw new Error("ShouldNotSucceed");
                })
                .catch(function(error) {
                    expect(error.toString()).to.match(/HttpStatus/);
                });
        });
    });
});