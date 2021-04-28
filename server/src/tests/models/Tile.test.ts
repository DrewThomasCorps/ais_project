import {expect} from 'chai';
import Tile from "../../models/Tile";
import {readFileSync} from "fs";

describe('Tile', function() {
    describe('fromJson()', function() {
        it('set all present values', function() {
            const tile = Tile.fromJson(readFileSync('src/tests/resources/models/tile_one.json').toString())
            expect(tile.id).to.be.equal(1);
            expect(tile.ICESName).to.be.equal('-1');
            expect(tile.west).to.be.equal(7.0);
            expect(tile.east).to.be.equal(13.0);
            expect(tile.north).to.be.equal(57.5);
            expect(tile.south).to.be.equal(54.5);
            expect(tile.scale).to.be.equal(1);
            expect(tile.filename).to.be.equal("ROOT.png");
            expect(tile.image_width).to.be.equal(2000);
            expect(tile.image_height).to.be.equal(2000);
            expect(tile.image_west).to.be.equal(7.0);
            expect(tile.image_south).to.be.equal(54.31614);
            expect(tile.image_east).to.be.equal(13.0);
            expect(tile.image_north).to.be.equal(57.669343);
            expect(tile.contained_by).to.be.equal(-1);
        });
    });
});
