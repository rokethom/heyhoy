/* eslint-disable prefer-arrow-callback */

const assert = require('assert');
const heyhoy = require('../');

/** @type {boolean} */
let verbose;

if (process.argv[3] === '--verbose')
{
        verbose = true;
}
else
{
        verbose = false;
}

describe('Work properly', function ()
{
        it('accepts empty code', function ()
        {
                const code1 = '';
                heyhoy(code1, verbose);

                const code2 = `
                
                
                
                `;
                heyhoy(code2, verbose);
        });

        it('prints number', function ()
        {
                const code = `
                x = 20 + 5
                print x
                x = x + 5
                print x
                `;
                heyhoy(code, verbose);
        });

        it('gives the last return value', function ()
        {
                const code = `
                y = 2 * 5
                x = 3 + 10 * y
                x = x * 2

                return y
                return x
                `;

                const result = heyhoy(code, verbose);
                assert.deepStrictEqual(result, 206);
        });

        it('random test: calculate surface area of cuboid', function ()
        {
                const code = `
                width = 50
                length = 100
                height = 20

                area = width * length + length * height + width * height
                area = 2 * area

                return area
                `;

                const result = heyhoy(code, verbose);
                assert.deepStrictEqual(result, 16000);
        });

        it('random test 😃', function ()
        {
                const code = `
                x1 = 10
                x2 = 20
                y1 = 50
                y2 = 60

                res = x1 * x2 + y1 * y2

                return res
                `;

                const result = heyhoy(code, verbose);
                assert.deepStrictEqual(result, 3200);
        });
});
