import { createWishboneFactory } from "./wishbone";
import * as FILES from './filehandler';

describe('createWishboneFromCart', () => {

    it('should create a factory function', () => {
      const result = createWishboneFactory();
      expect(result).toBeDefined();
    });


    it('should return a wishbone when factory function called with null cart', () => {
      const result = createWishboneFactory();
      expect(result).toBeDefined();

      const bone = result(null);
      expect(bone).toEqual(jasmine.any(Object));
            
    });

    it('should return a wishbone when factory function called with real cart', () => {
      FILES.loadCartFromUrl('base/testfiles/1.nes').then((cart)=> {
        const wishboner = createWishboneFactory();
        const bone = wishboner(cart);

        expect(cart.mapperId).toBe(0);
        expect(cart.ROMHashFunction).toBe('654EC82D');
        expect(wishboner).toBeDefined();
  
        expect(bone).toEqual(jasmine.any(Object));
        bone.poweron();
        bone.runframe();

      }, (reason) => {
        fail(reason);
      });
    });


});