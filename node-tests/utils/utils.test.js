const expect = require('expect');

const utils = require('./utils');

describe('Utils', () => {

    describe('#add', () => {
        it('should add two numbers', () => {
            const res = utils.add(33, 11);
        
            expect(res).toBe(44).toBeA('number');
        });
    })

    it('should async add two numbers', (done) => {
        utils.asyncAdd(4, 3, (sum) => {
            expect(sum).toBe(7).toBeA('number');
            done();
        })
    });
    
    it('should square a number', () => {
        const res = utils.sqare(9);
    
        expect(res).toBe(81).toBeA('number');
    });
    
    it('should async square a number', (done) => {
        utils.asyncSquare(3, (square) => {
            expect(square).toBe(9).toBeA('number');
            done();
        })
    });
    
    it('should verify first and last names are set', () => {
        const userObj = {
             age: 34,
             location: 'Oława'
        }
        const res = utils.setName(userObj, 'Jurek Skowron');
    
        expect(res).toInclude({
            firstName: 'Jurek',
            lastName: 'Skowron'
        }).toBeA('object');
    });
});



