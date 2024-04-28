import * as FILES from './filehandler';

async function getFile(): Promise<File> {
  const response = await fetch('base/testfiles/1.nes');
  const blob = await response.blob();
  return <File>Object.assign(blob, { lastModifiedDate: new Date, name: '1.nes' })
};

describe('loadCartFromUrl', () => {

    it('should return a basecart from a valid url', (done) => {
      const result = FILES.loadCartFromUrl('base/testfiles/1.nes');
      result.then(function(cart) {

        expect(cart).toBeDefined();
        expect(cart.mapperId).toBe(0);
        expect(cart.ROMHashFunction).toBe('654EC82D');

        done();
      }, function (reason) {
        fail(reason);
      });
    });

    it('should reject promise on failed load', (done) => {
      FILES.loadCartFromUrl('/fart/poop.nes').then(function(cart) {
        fail();
      }, function (reason) {
        expect(reason).toMatch('invalid url');
        done();
      });

    });

});

describe('loadCartFromFile', () => {
  const file = new File(['hello i am a file'], 'testfile.txt');

  it('should reject promise on undefined file', (done) => {
    const promise =  FILES.loadCartFromFile(undefined);

    promise.then(function(result) {
      // Promise is resolved
      fail();
    }, function(reason) {
      // Promise is rejected
      expect(reason).toMatch('file is undefined');
      done();
    });
  });

  it('should reject promise for an invalid file', (done) => {
    const promise =  FILES.loadCartFromFile(file);

    promise.then(function(result) {
      // Promise is resolved
      fail();
    }, function(reason) {
      // Promise is rejected
      expect(reason).toMatch('invalid file type testfile.txt')
      done(); 
    });
  });

  it('should load a proper file and return a basecart', (done) => {
    const rom = getFile().then((rom) => {
      const promise =  FILES.loadCartFromFile(rom);

      promise.then(function(result) {
        // Promise is resolved
        expect(result).toBeDefined();
        expect(result.mapperId).toBe(0);
        expect(result.ROMHashFunction).toBe('654EC82D');
        done();
      }, function(reason) {
        // Promise is rejected
        fail(reason);
      });
    });
  });

});
