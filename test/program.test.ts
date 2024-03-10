"use strict"

import{ describe, it, expect } from 'vitest'
import{ Program } from '../src/program'

describe('t0rr3nt3', function(){
    describe('program', function(){
        it('it works', function(){
            const program = new Program();
            
            program.run();
            
            expect(true).toBeTruthy();
        });
    });
});