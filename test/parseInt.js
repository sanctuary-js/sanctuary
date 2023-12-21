import {deepStrictEqual as eq, throws} from 'assert';

import S from '../index.js';


test ('parseInt', () => {

  eq (String (S.parseInt), 'parseInt :: Radix -> String -> Maybe Integer');

  eq (S.parseInt (10) ('42'), S.Just (42));
  eq (S.parseInt (16) ('2A'), S.Just (42));
  eq (S.parseInt (10) ('NaN'), S.Nothing);
  eq (S.parseInt (10) ('xxx'), S.Nothing);

  // Accepts radix in [2 .. 36]
  eq (S.parseInt (2) ('1'), S.Just (1));
  eq (S.parseInt (2) ('2'), S.Nothing);
  eq (S.parseInt (3) ('2'), S.Just (2));
  eq (S.parseInt (3) ('3'), S.Nothing);
  eq (S.parseInt (4) ('3'), S.Just (3));
  eq (S.parseInt (4) ('4'), S.Nothing);
  eq (S.parseInt (5) ('4'), S.Just (4));
  eq (S.parseInt (5) ('5'), S.Nothing);
  eq (S.parseInt (6) ('5'), S.Just (5));
  eq (S.parseInt (6) ('6'), S.Nothing);
  eq (S.parseInt (7) ('6'), S.Just (6));
  eq (S.parseInt (7) ('7'), S.Nothing);
  eq (S.parseInt (8) ('7'), S.Just (7));
  eq (S.parseInt (8) ('8'), S.Nothing);
  eq (S.parseInt (9) ('8'), S.Just (8));
  eq (S.parseInt (9) ('9'), S.Nothing);
  eq (S.parseInt (10) ('9'), S.Just (9));
  eq (S.parseInt (10) ('A'), S.Nothing);
  eq (S.parseInt (11) ('A'), S.Just (10));
  eq (S.parseInt (11) ('B'), S.Nothing);
  eq (S.parseInt (12) ('B'), S.Just (11));
  eq (S.parseInt (12) ('C'), S.Nothing);
  eq (S.parseInt (13) ('C'), S.Just (12));
  eq (S.parseInt (13) ('D'), S.Nothing);
  eq (S.parseInt (14) ('D'), S.Just (13));
  eq (S.parseInt (14) ('E'), S.Nothing);
  eq (S.parseInt (15) ('E'), S.Just (14));
  eq (S.parseInt (15) ('F'), S.Nothing);
  eq (S.parseInt (16) ('F'), S.Just (15));
  eq (S.parseInt (16) ('G'), S.Nothing);
  eq (S.parseInt (17) ('G'), S.Just (16));
  eq (S.parseInt (17) ('H'), S.Nothing);
  eq (S.parseInt (18) ('H'), S.Just (17));
  eq (S.parseInt (18) ('I'), S.Nothing);
  eq (S.parseInt (19) ('I'), S.Just (18));
  eq (S.parseInt (19) ('J'), S.Nothing);
  eq (S.parseInt (20) ('J'), S.Just (19));
  eq (S.parseInt (20) ('K'), S.Nothing);
  eq (S.parseInt (21) ('K'), S.Just (20));
  eq (S.parseInt (21) ('L'), S.Nothing);
  eq (S.parseInt (22) ('L'), S.Just (21));
  eq (S.parseInt (22) ('M'), S.Nothing);
  eq (S.parseInt (23) ('M'), S.Just (22));
  eq (S.parseInt (23) ('N'), S.Nothing);
  eq (S.parseInt (24) ('N'), S.Just (23));
  eq (S.parseInt (24) ('O'), S.Nothing);
  eq (S.parseInt (25) ('O'), S.Just (24));
  eq (S.parseInt (25) ('P'), S.Nothing);
  eq (S.parseInt (26) ('P'), S.Just (25));
  eq (S.parseInt (26) ('Q'), S.Nothing);
  eq (S.parseInt (27) ('Q'), S.Just (26));
  eq (S.parseInt (27) ('R'), S.Nothing);
  eq (S.parseInt (28) ('R'), S.Just (27));
  eq (S.parseInt (28) ('S'), S.Nothing);
  eq (S.parseInt (29) ('S'), S.Just (28));
  eq (S.parseInt (29) ('T'), S.Nothing);
  eq (S.parseInt (30) ('T'), S.Just (29));
  eq (S.parseInt (30) ('U'), S.Nothing);
  eq (S.parseInt (31) ('U'), S.Just (30));
  eq (S.parseInt (31) ('V'), S.Nothing);
  eq (S.parseInt (32) ('V'), S.Just (31));
  eq (S.parseInt (32) ('W'), S.Nothing);
  eq (S.parseInt (33) ('W'), S.Just (32));
  eq (S.parseInt (33) ('X'), S.Nothing);
  eq (S.parseInt (34) ('X'), S.Just (33));
  eq (S.parseInt (34) ('Y'), S.Nothing);
  eq (S.parseInt (35) ('Y'), S.Just (34));
  eq (S.parseInt (35) ('Z'), S.Nothing);
  eq (S.parseInt (36) ('Z'), S.Just (35));
  eq (S.parseInt (36) ('['), S.Nothing);

  // Throws if radix is not in [2 .. 36]
  throws (() => { S.parseInt (1); },
          new TypeError ('Invalid value\n' +
                         '\n' +
                         'parseInt :: Radix -> String -> Maybe Integer\n' +
                         '            ^^^^^\n' +
                         '              1\n' +
                         '\n' +
                         '1)  1 :: Number\n' +
                         '\n' +
                         'The value at position 1 is not a member of ‘Radix’.\n'));

  throws (() => { S.parseInt (37); },
          new TypeError ('Invalid value\n' +
                         '\n' +
                         'parseInt :: Radix -> String -> Maybe Integer\n' +
                         '            ^^^^^\n' +
                         '              1\n' +
                         '\n' +
                         '1)  37 :: Number\n' +
                         '\n' +
                         'The value at position 1 is not a member of ‘Radix’.\n'));

  // Is not case-sensitive
  eq (S.parseInt (16) ('FF'), S.Just (255));
  eq (S.parseInt (16) ('Ff'), S.Just (255));
  eq (S.parseInt (16) ('fF'), S.Just (255));
  eq (S.parseInt (16) ('ff'), S.Just (255));

  // Accepts optional "+" or "-" prefix
  eq (S.parseInt (10) ('+42'), S.Just (42));
  eq (S.parseInt (16) ('+2A'), S.Just (42));
  eq (S.parseInt (10) ('-42'), S.Just (-42));
  eq (S.parseInt (16) ('-2A'), S.Just (-42));

  // Accepts optional "0x" or "0X" prefix when radix is 16
  eq (S.parseInt (16) ('0xFF'), S.Just (255));
  eq (S.parseInt (16) ('0XFF'), S.Just (255));
  eq (S.parseInt (17) ('0xFF'), S.Nothing);
  eq (S.parseInt (17) ('0XFF'), S.Nothing);
  eq (S.parseInt (16) ('+0xFF'), S.Just (255));
  eq (S.parseInt (16) ('+0XFF'), S.Just (255));
  eq (S.parseInt (16) ('-0xFF'), S.Just (-255));
  eq (S.parseInt (16) ('-0XFF'), S.Just (-255));

  // Returns Nothing if one or more characters are invalid
  eq (S.parseInt (10) ('12.34'), S.Nothing);  // parseInt ('12.34', 10) == 12
  eq (S.parseInt (16) ('alice'), S.Nothing);  // parseInt ('alice', 16) == 10

  // Restricts to exactly representable range (-2^53 .. 2^53)
  eq (S.parseInt (10) ('9007199254740991'), S.Just (9007199254740991));
  eq (S.parseInt (10) ('-9007199254740991'), S.Just (-9007199254740991));
  eq (S.parseInt (10) ('9007199254740992'), S.Nothing);
  eq (S.parseInt (10) ('-9007199254740992'), S.Nothing);
  eq (S.parseInt (10) ('Infinity'), S.Nothing);
  eq (S.parseInt (10) ('-Infinity'), S.Nothing);

});
