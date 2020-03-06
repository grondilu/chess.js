/*
 * Copyright (c) 2020, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

"use strict";
const BLACK = 'b', WHITE = 'w', EMPTY = -1,

  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k',

  DEFAULT_POSITION =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  SYMBOLS = 'pnbrqkPNBRQK',

  POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'],

  PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  },

  PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1]
  },

  // prettier-ignore
  ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
    0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
    0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
    0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
    0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
    0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
    0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
    0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ],

  // prettier-ignore
  RAYS = [
    17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
    0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
    0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
    0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
    0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
    0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
    0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
    1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
    0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
    0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
    0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
    0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
    0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
    0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ],

  SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 },

  FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  },

  BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  },

  RANK_1 = 7,
  RANK_2 = 6,
  RANK_3 = 5,
  RANK_4 = 4,
  RANK_5 = 3,
  RANK_6 = 2,
  RANK_7 = 1,
  RANK_8 = 0,

  SECOND_RANK = { b: RANK_7, w: RANK_2 },

  // prettier-ignore
  SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  },

  ROOKS = {
    w: [
      { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }
    ],
    b: [
      { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }
    ]
  },

  ERRORS = [
    "FEN string must contain six space-delimited fields.",                  // 0
    "6th field (move number) must be a positive integer.",                  // 1
    "5th field (half move counter) must be a non-negative integer.",        // 2
    "4th field (en-passant square) is invalid.",                            // 3
    "3rd field (castling availability) is invalid.",                        // 4
    "2nd field (side to move) is invalid.",                                 // 5
    "1st field (piece positions) does not contain 8 '/'-delimited rows.",   // 6
    "1st field (piece positions) is invalid [consecutive numbers].",        // 7
    "1st field (piece positions) is invalid [invalid piece].",              // 8
    "1st field (piece positions) is invalid [row too large].",              // 9
    "Illegal en-passant square",                                           // 10
    "Wrong number of kings"
  ].map(msg => new Error(msg));

function die(msg) { throw new Error(msg); }
function is_digit(c) { return '0123456789'.indexOf(c) !== -1; }
function algebraic(i) {
  let f = file(i), r = rank(i);
  return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
}
function rank(i) { return i >> 4; }
function file(i) { return i & 15; }
function swap_color(c) { return c === WHITE ? BLACK : WHITE; }
function validate_fen(fen) {
  let tokens = fen.split(/\s+/);
  if (tokens.length !== 6) throw ERRORS[0];
  if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) throw ERRORS[1];
  if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) throw ERRORS[2];
  if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) throw ERRORS[3];
  if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) throw ERRORS[4];
  if (!/^(w|b)$/.test(tokens[1])) throw ERRORS[5];
  let rows = tokens[0].split('/');
  if (rows.length !== 8) throw ERRORS[6];

  for (let i = 0; i < rows.length; i++) {
    /* check for right sum of fields AND not two numbers in succession */
    let sum_fields = 0,
      previous_was_number = false;

    for (let k = 0; k < rows[i].length; k++) {
      if (!isNaN(rows[i][k])) {
        if (previous_was_number) throw ERRORS[7];
        sum_fields += parseInt(rows[i][k], 10);
        previous_was_number = true;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) throw ERRORS[8];
        sum_fields += 1;
        previous_was_number = false;
      }
    }
    if (sum_fields !== 8) 
      throw ERRORS[9];
  }

  if (
    (tokens[3][1] == '3' && tokens[1] == 'w') ||
    (tokens[3][1] == '6' && tokens[1] == 'b')
  ) throw ERRORS[10];

  if (
    [/k/g, /K/g]
    .map(r => tokens[0].match(r))
    .map(m => m ? m.length : 0)
    .join() !== "1,1"
  ) throw ERRORS[11];

}

class Move {
  constructor(move) {
    let match = move.match(
      /([a-h][1-8])([a-h][1-8])([qrbnQRBN])?/
    );
    if (match) {
      this.from = SQUARES[match[1]];
      this.to   = SQUARES[match[2]];
      if (match[3]) this.promotion = match[3];
      if (this.from == this.to) die("degenerate move");
      if (this.promotion && !(rank(this.to) == 7 || rank(this.to) == 0))
        die("wrong destination rank for a promotion");
    } else die("wrong move syntax");
  }
  get UCI() {
    return algebraic(this.from) + algebraic(this.to) +
      (this.promotion || '');
  }
}
class Position {
  constructor(fen = DEFAULT_POSITION) {
    validate_fen(fen);
    this.board = new Array(128);
    this.kings = { w: EMPTY, b: EMPTY };
    this.castling = { w: 0, b: 0 };

    let tokens = fen.split(/\s+/),
      position = tokens[0],
      square = 0;

    for (let i = 0; i < position.length; i++) {
      let piece = position.charAt(i);
      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        let color = piece < 'a' ? WHITE : BLACK,
          type = piece.toLowerCase();
        this.board[square] = { type, color };
        if (type === KING) this.kings[color] = square;
        square++;
      }
    }

    this.turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) this.castling.w |= BITS.KSIDE_CASTLE;
    if (tokens[2].indexOf('Q') > -1) this.castling.w |= BITS.QSIDE_CASTLE;
    if (tokens[2].indexOf('k') > -1) this.castling.b |= BITS.KSIDE_CASTLE;
    if (tokens[2].indexOf('q') > -1) this.castling.b |= BITS.QSIDE_CASTLE;

    this.ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
    this.half_moves = parseInt(tokens[4], 10);
    this.move_number = parseInt(tokens[5], 10);

  }
  get fen() {
    let empty = 0, fen = '';
    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (this.board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        let color = this.board[i].color,
          piece = this.board[i].type;

        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    let cflags = '';
    if (this.castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
    if (this.castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
    if (this.castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
    if (this.castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    let epflags = this.ep_square === EMPTY ? '-' : algebraic(this.ep_square);

    return [fen, this.turn, cflags, epflags, this.half_moves, this.move_number].join(' ')
  }

  moves(options) {
    let color = this.turn, board = this.board,
      moves = [],
      us = this.turn,
      them = swap_color(us),

      first_sq = SQUARES.a8,
      last_sq = SQUARES.h1,
      single_square = false,

      /* do we want legal moves? */
      legal =
      typeof options !== 'undefined' && 'legal' in options
      ? options.legal
      : true;
    function add_move(from, to) {
      if (
        board[from].type === PAWN &&
        (rank(to) === RANK_8 || rank(to) === RANK_1)
      ) {
        /* pawn promotion */
        for (let piece of [QUEEN, ROOK, BISHOP, KNIGHT])
          moves.push(new Move(algebraic(from)+algebraic(to)+piece));
      } else {
        moves.push(new Move(algebraic(from)+algebraic(to)));
      }
    }

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return [];
      }
    }

    for (let i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board ? */
      if (i & 0x88) { i += 7; continue; }

      let piece = this.board[i];
      if (piece == null || piece.color !== us) continue;

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        let square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
          add_move(i, square);

          /* double square */
          square = i + PAWN_OFFSETS[us][1];
          if (SECOND_RANK[us] === rank(i) && this.board[square] == null) {
            add_move(i, square);
          }
        }

        /* pawn captures */
        for (let j = 2; j < 4; j++) {
          let square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue

          if (this.board[square] != null && this.board[square].color === them) {
            add_move(i, square);
          } else if (square === this.ep_square) {
            add_move(i, ep_square);
          }
        }
      } else {
        for (let j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          let offset = PIECE_OFFSETS[piece.type][j],
            square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (this.board[square] == null) {
              add_move(i, square);
            } else {
              if (this.board[square].color === us) break;
              add_move(i, square);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if (!single_square || last_sq === this.kings[us]) {
      /* king-side castling */
      if (this.castling[us] & BITS.KSIDE_CASTLE) {
        let castling_from = this.kings[us],
          castling_to = castling_from + 2;

        if (
          this.board[castling_from + 1] == null &&
          this.board[castling_to] == null &&
          !this.attacked(them, castling_from) &&
          !this.attacked(them, castling_from + 1) &&
          !this.attacked(them, castling_to)
        ) add_move(castling_from, castling_to);
      }

      /* queen-side castling */
      if (this.castling[us] & BITS.QSIDE_CASTLE) {
        let castling_from = this.kings[us],
          castling_to = castling_from - 2;

        if (
          this.board[castling_from - 1] == null &&
          this.board[castling_from - 2] == null &&
          this.board[castling_from - 3] == null &&
          !this.attacked(them, castling_from) &&
          !this.attacked(them, castling_from - 1) &&
          !this.attacked(them, castling_to)
        ) add_move(castling_from, castling_to);
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) return moves;

    /* filter out illegal moves */
    let legal_moves = [];
    for (let move of moves) {
      try { this.make_move(move); }
      catch (err) { continue; }
      legal_moves.push(move);
    }

    return legal_moves;
  }
  attacked(color, square) {
    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue;
      }

      /* if empty square or wrong color */
      if (this.board[i] == null || this.board[i].color !== color) continue;

      let piece = this.board[i], difference = i - square,
        index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        let offset = RAYS[index], j = i + offset,
          blocked = false;

        while (j !== square) {
          if (this.board[j] != null) {
            blocked = true;
            break;
          }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }
  get check() { return this.king_attacked(this.turn); }
  king_attacked(color) {
    return this.attacked(swap_color(color), this.kings[color]);
  }

  make_move(move) {
    if (move instanceof Move) {
      let clone = this.clone,
        turn     = clone.turn,
        board    = clone.board,
        castling = clone.castling,
        kings    = clone.kings,
        piece    = board[move.from],
        offset   = move.to - move.from;

      if (!piece) { die("Empty square"); }
      else if (piece.type === PAWN) {
        let pawn_offsets = PAWN_OFFSETS[turn];
        switch (offset) {
          case pawn_offsets[0]:
            if (board[move.to])
              die("Illegal single-square pawn move");
            if (
              (
              (rank(move.to) === RANK_8 && turn === WHITE) ||
              (rank(move.to) === RANK_1 && turn === BLACK)
              ) && !move.promotion
            ) die("promotion was expected");
            break;
          case pawn_offsets[1]:
            let ep_square = move.from + pawn_offsets[0];
            if (
              !(
                SECOND_RANK[turn] === rank(move.from) &&
                board[ep_square] == null &&
                board[move.to] == null
              )
            ) die("Illegal double-squared pawn move");
            clone.ep_square = ep_square;
            break;
          case pawn_offsets[2]:
          case pawn_offsets[3]:
            if (!board[move.to] && clone.ep_square !== move.to)
              die("Illegal pawn capture");
            break;
          default:
            die("Illegal pawn move");
        }
        clone.half_moves = 0;
      } else if (piece.type === 'k' || piece.type == 'n') {
        if (!PIECE_OFFSETS[piece.type].includes(offset))
          die("wrong move offset for " + (piece.type == 'k' ? "king" : "knight"));
        if (board[move.to] && board[move.to].color === turn)
          die("destination square already occupied");
      } else {
        let piece_offsets = PIECE_OFFSETS[piece.type],
          piece_offset = piece_offsets.find(x => offset%x == 0 && offset/x > 0);
        if (!piece_offset)
          die("illegal piece displacement");
        for (let o = piece_offset; o < offset; o+=piece_offset)
          if (board[o])
            die("blocked displacement");
      }
      if (board[move.to] && board[move.to].type == KING)
        die("destination square is occupied by a king");
      if (board[move.to] && board[move.to].color == turn)
        die("destination square is occupied by same color piece");
      if (turn === BLACK) clone.move_number++;
      if (board[move.to] && board[move.to].color !== turn)
        clone.half_moves = 0;
      clone.turn = swap_color(clone.turn);
      board[move.to] = board[move.from];
      board[move.from] = null;

      if (move.promotion)
        board[move.to].type = move.promotion;

      if (this.check) die("check!");
      return clone;
    } else die("wrong argument type");

  }

  get clone() { return new Position(this.fen); }

}

class Game {
  constructor(header, moves, adjudication = "*") {
    if (typeof header !== "object")
      die("wrong header type");
    if (typeof moves == "array" && moves.every(x => x instanceof Move))
      die("wrong moves type");
    if (!(POSSIBLE_RESULTS.includes(adjudication)))
      die("wrong adjudictation type");
    this.header = header;
    this.moves = moves;
    this.adjudication = adjudication;
  }
  get pgn() {
  }
}

var Chess = function(fen = DEFAULT_POSITION) {

  let board, kings, turn, castling, ep_square, half_moves, move_number,
    history, header;

  clear();
  load(fen);

  function clear(keep_headers = false) {
    board = new Array(128);
    kings = { w: EMPTY, b: EMPTY };
    turn = WHITE;
    castling = { w: 0, b: 0 };
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    if (!keep_headers) header = {};
    update_setup(generate_fen());
  }

  function reset() { load(DEFAULT_POSITION); }

  function load(fen, keep_headers = false) {
    let tokens = fen.split(/\s+/),
      position = tokens[0],
      square = 0;

    validate_fen(fen);

    clear(keep_headers);

    for (let i = 0; i < position.length; i++) {
      let piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        let color = piece < 'a' ? WHITE : BLACK;
        put({ type: piece.toLowerCase(), color: color }, algebraic(square));
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) castling.w |= BITS.KSIDE_CASTLE;
    if (tokens[2].indexOf('Q') > -1) castling.w |= BITS.QSIDE_CASTLE;
    if (tokens[2].indexOf('k') > -1) castling.b |= BITS.KSIDE_CASTLE;
    if (tokens[2].indexOf('q') > -1) castling.b |= BITS.QSIDE_CASTLE;

    ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true;
  }

  function generate_fen() {
    let empty = 0, fen = '';

    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        let color = board[i].color, piece = board[i].type;

        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    let cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    let epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
  }

  function set_header(args) {
    for (let i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
      }
    }
    return header;
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    let piece = board[SQUARES[square]];
    return piece ? { type: piece.type, color: piece.color } : null;
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) return false;

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) return false;

    /* check for valid square */
    if (!(square in SQUARES)) return false;

    let sq = SQUARES[square];

    /* don't let the user place more than one king */
    if (
      piece.type == KING &&
      !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
    ) return false;

    board[sq] = { type: piece.type, color: piece.color }
    if (piece.type === KING) kings[piece.color] = sq;

    update_setup(generate_fen());

    return true;
  }

  function remove(square) {
    let piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING)
      kings[piece.color] = EMPTY;

    update_setup(generate_fen());

    return piece;
  }

  function build_move(board, from, to, flags, promotion) {
    let move = {
      color: turn,
      from, to, flags,
      piece: board[from].type
    }

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
      move.captured = PAWN;
    }
    return move;
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (
        board[from].type === PAWN &&
        (rank(to) === RANK_8 || rank(to) === RANK_1)
      ) {
        const pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
        for (let i = 0, len = pieces.length; i < len; i++) {
          moves.push(build_move(board, from, to, flags, pieces[i]))
        }
      } else {
        moves.push(build_move(board, from, to, flags));
      }
    }

    let moves = [],
      us = turn,
      them = swap_color(us),

      first_sq = SQUARES.a8,
      last_sq = SQUARES.h1,
      single_square = false,

      /* do we want legal moves? */
      legal =
      typeof options !== 'undefined' && 'legal' in options
      ? options.legal
      : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return [];
      }
    }

    for (let i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue;
      }

      let piece = board[i];
      if (piece == null || piece.color !== us) continue;

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        let square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
          add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          square = i + PAWN_OFFSETS[us][1];
          if (SECOND_RANK[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (let j = 2; j < 4; j++) {
          let square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue

          if (board[square] != null && board[square].color === them) {
            add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
            add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (let j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          let offset = PIECE_OFFSETS[piece.type][j],
            square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if (!single_square || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        let castling_from = kings[us],
          castling_to = castling_from + 2;

        if (
          board[castling_from + 1] == null &&
          board[castling_to] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from + 1) &&
          !attacked(them, castling_to)
        ) add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        let castling_from = kings[us],
          castling_to = castling_from - 2;

        if (
          board[castling_from - 1] == null &&
          board[castling_from - 2] == null &&
          board[castling_from - 3] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from - 1) &&
          !attacked(them, castling_to)
        ) add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) return moves;

    /* filter out illegal moves */
    let legal_moves = [];
    for (let move of moves) {
      make_move(move);
      if (!king_attacked(us)) legal_moves.push(move);
      undo_move();
    }

    return legal_moves
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} sloppy Use the sloppy SAN generator to work around over
   * disambiguation bugs in Fritz and Chessbase.  See below:
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  function move_to_san(move, sloppy) {
    let output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O'
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O'
    } else {
      let disambiguator = get_disambiguator(move, sloppy);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase()
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output;
  }

  // parses all of the decorators out of a SAN string
  function stripped_san(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
  }

  function attacked(color, square) {
    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue;
      }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      let piece = board[i],
        difference = i - square,
        index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        let offset = RAYS[index], j = i + offset,
          blocked = false;

        while (j !== square) {
          if (board[j] != null) {
            blocked = true;
            break;
          }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }

  function in_check() {
    return king_attacked(turn);
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0;
  }

  function insufficient_material() {
    let pieces = {},
      bishops = [],
      num_pieces = 0,
      sq_color = 0;

    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) {
        i += 7;
        continue;
      }

      let piece = board[i];
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }

    /* k vs. k */
    if (num_pieces === 2) {
      return true
    } else if (
      /* k vs. kn .... or .... k vs. kb */
      num_pieces === 3 &&
      (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true
    } else if (num_pieces === pieces[BISHOP] + 2) {
      /* kb vs. kb where any number of bishops are all on the same color */
      let sum = 0, len = bishops.length;
      for (let i = 0; i < len; i++) sum += bishops[i];
      if (sum === 0 || sum === len) return true;
    }

    return false;
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    let moves = [],
      positions = {},
      repetition = false;

    while (true) {
      let move = undo_move();
      if (!move) break;
      moves.push(move);
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      let fen = generate_fen()
        .split(' ')
        .slice(0, 4)
        .join(' ');

      /* has the position occurred three or move times */
      positions[fen] = fen in positions ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) repetition = true;

      if (!moves.length) break;
      make_move(moves.pop())
    }

    return repetition;
  }

  function push(move) {
    history.push({
      move,
      kings: { b: kings.b, w: kings.w },
      turn,
      castling: { b: castling.b, w: castling.w },
      ep_square,
      half_moves,
      move_number
    })
  }

  function make_move(move) {
    let us = turn,
    them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) 
      board[move.to + (turn === BLACK ? -16 : +16)] = null;

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) 
      board[move.to] = { type: move.promotion, color: us };

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        let castling_to = move.to - 1,
          castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        let castling_to = move.to + 1,
          castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (let rook of ROOKS[us]) {
        if (
          move.from === rook.square &&
          castling[us] & rook.flag
        ) {
          castling[us] ^= rook.flag;
          break;
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (let rook of ROOKS[them]) {
        if (
          move.to === rook.square &&
          castling[them] & rook.flag
        ) {
          castling[them] ^= rook.flag;
          break;
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn)
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) return null;

    kings = old.kings
    turn = old.turn
    castling = old.castling
    ep_square = old.ep_square
    half_moves = old.half_moves
    move_number = old.move_number

    let move = old.move,
      us = turn,
      them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece; // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = { type: move.captured, color: them }
    } else if (move.flags & BITS.EP_CAPTURE) {
      let index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = { type: PAWN, color: them }
    }

    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      let castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move;
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, sloppy) {
    let moves = generate_moves({ legal: !sloppy }),

    from = move.from,
    to = move.to,
    piece = move.piece,

    ambiguities = 0,
    same_rank = 0,
    same_file = 0;

    for (let move of moves) {
      let ambig_from = move.from,
        ambig_to = move.to,
        ambig_piece = move.piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) same_rank++;
        if (file(from) === file(ambig_from)) same_file++;
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from)
      } else if (same_file > 0) {
        /* if the moving piece rests on the same file, use the rank symbol as the
         * disambiguator
         */
        return algebraic(from).charAt(1);
      } else {
        /* else use the file symbol */
        return algebraic(from).charAt(0);
      }
    }

    return '';
  }

  function ascii() {
    let s = '   +------------------------+\n'
    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
      } else {
        let piece = board[i].type,
          color = board[i].color,
          symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
      }

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
      }
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s;
  }

  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  function move_from_san(move, sloppy) {
    // strip off any move decorations: e.g Nf3+?!
    let clean_move = stripped_san(move);

    // if we're using the sloppy parser run a regex to grab piece, to, and from
    // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
    if (sloppy) {
      var matches = clean_move.match(
        /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
      )
      if (matches) {
        var piece = matches[1]
        var from = matches[2]
        var to = matches[3]
        var promotion = matches[4]
      }
    }

    for (let move of generate_moves()) {
      // try the strict parser first, then the sloppy parser if requested
      // by the user
      if (
        clean_move === stripped_san(move_to_san(move)) ||
        (sloppy && clean_move === stripped_san(move_to_san(move, true)))
      ) {
        return move;
      } else {
        if (
          matches &&
          (!piece || piece.toLowerCase() == move.piece) &&
          SQUARES[from] == move.from &&
          SQUARES[to] == move.to &&
          (!promotion || promotion.toLowerCase() == move.promotion)
        ) {
          return move;
        }
      }
    }

    return null;
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) { return i >> 4; }
  function file(i) { return i & 15; }

  function algebraic(i) {
    let f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
  }

  function swap_color(c) { return c === WHITE ? BLACK : WHITE; }
  function is_digit(c) { return '0123456789'.indexOf(c) !== -1; }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    let move = clone(ugly_move);
    move.san = move_to_san(move, false);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    let flags = '';

    for (let flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move;
  }

  function clone(obj) {
    let dupe = obj instanceof Array ? [] : {};

    for (let property in obj) {
      if (typeof obj[property] === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe;
  }

  function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    let moves = generate_moves({ legal: false }),
      nodes = 0,
      color = turn;

    for (let move of moves) {
      make_move(move)
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          nodes += perft(depth - 1);
        } else {
          nodes++;
        }
      }
      undo_move();
    }

    return nodes
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING,
    FLAGS, ERRORS, DEFAULT_POSITION,
    SQUARES: (function() {
      /* from the ECMA-262 spec (section 12.6.4):
       * "The mechanics of enumerating the properties ... is
       * implementation dependent"
       * so: for (var sq in SQUARES) { keys.push(sq); } might not be
       * ordered correctly
       */
      let keys = [];
      for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (i & 0x88) {
          i += 7;
          continue;
        }
        keys.push(algebraic(i));
      }
      return keys;
    })(),

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load, reset, in_check, in_checkmate, in_stalemate, insufficient_material,
    in_threefold_repetition, validate_fen, ascii, turn, clear, put, get,
    remove, perft,

    Game, Position, Move,

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      let ugly_moves = generate_moves(options),
        moves = [];

      for (let move of ugly_moves) {
        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (
          typeof options !== 'undefined' &&
          'verbose' in options &&
          options.verbose
        ) {
          moves.push(make_pretty(move))
        } else {
          moves.push(move_to_san(move, false))
        }
      }

      return moves;
    },
    in_draw: () =>
        half_moves >= 100 ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition(),
    game_over: () =>
        half_moves >= 100 ||
        in_checkmate() ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition(),
    fen: () => generate_fen(),
    board: function() {
      let output = [],
        row = [];

      for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (board[i] == null) {
          row.push(null);
        } else {
          row.push({ type: board[i].type, color: board[i].color });
        }
        if ((i + 1) & 0x88) {
          output.push(row);
          row = [];
          i += 8;
        }
      }

      return output;
    },
    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      let newline =
        typeof options === 'object' && typeof options.newline_char === 'string'
        ? options.newline_char
        : '\n',
        max_width =
        typeof options === 'object' && typeof options.max_width === 'number'
        ? options.max_width
        : 0,
        result = [],
        header_exists = false;

      /* add the PGN header headerrmation */
      for (let i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' "' + header[i] + '"]' + newline);
        header_exists = true;
      }

      if (header_exists && history.length) result.push(newline);

      /* pop all of history onto reversed_history */
      let reversed_history = [];
      while (history.length > 0) reversed_history.push(undo_move());

      let moves = [], move_string = '';

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        let move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (!history.length && move.color === 'b') {
          move_string = move_number + '. ...';
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = move_number + '.';
        }

        move_string = move_string + ' ' + move_to_san(move, false);
        make_move(move);
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(move_string);
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
      }

      /* history should be back to what is was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) 
        return result.join('') + moves.join(' ');

      /* wrap the PGN output at max_width */
      let current_width = 0;
      for (let i = 0; i < moves.length; i++) {
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {
          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') result.pop();

          result.push(newline);
          current_width = 0;
        } else if (i !== 0) {
          result.push(' ');
          current_width++;
        }
        result.push(moves[i]);
        current_width += moves[i].length;
      }

      return result.join('');
    },
    load_pgn: function(pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      let sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
        ? options.sloppy
        : false;

      function mask(str) { return str.replace(/\\/g, '\\'); }

      function has_keys(object) {
        for (let key in object) {
          return true;
        }
        return false;
      }

      function parse_pgn_header(header, options) {
        let newline_char =
          typeof options === 'object' &&
          typeof options.newline_char === 'string'
          ? options.newline_char
          : '\r?\n',
          header_obj = {},
          headers = header.split(new RegExp(mask(newline_char))),
          key = '',
          value = '';

        for (let header of headers) {
          key = header.replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = header.replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
          }
        }

        return header_obj
      }

      let newline_char =
        typeof options === 'object' && typeof options.newline_char === 'string'
        ? options.newline_char
        : '\r?\n',

        // RegExp to split header. Takes advantage of the fact that header and movetext
        // will always have a blank line between them (ie, two newline_char's).
        // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
        header_regex = new RegExp(
          '^(\\[((?:' +
          mask(newline_char) +
          ')|.)*\\])' +
          '(?:' +
          mask(newline_char) +
          '){2}'
        ),

        // If no header given, begin with moves.
        header_string = header_regex.test(pgn)
        ? header_regex.exec(pgn)[1]
        : '';

      // Put the board in the starting position
      reset();

      /* parse PGN header */
      let headers = parse_pgn_header(header_string, options);
      for (let key in headers)
        set_header([key, headers[key]]);

      /* load the starting position indicated by [Setup '1'] and
       * [FEN position] */
      if (headers['SetUp'] === '1') {
        if (!('FEN' in headers && load(headers['FEN'], true))) {
          // second argument to load: don't clear the headers
          return false;
        }
      }

      /* delete header to get the moves */
      let ms = pgn
        .replace(header_string, '')
        .replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete comments */
      ms = ms.replace(/(\{[^}]+\})+?/g, '')

      /* delete recursive annotation variations */
      let rav_regex = /(\([^\(\)]+\))+?/g;
      while (rav_regex.test(ms)) 
        ms = ms.replace(rav_regex, '');

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '');

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '');

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '');

      /* trim and get array of moves */
      let moves = trim(ms)
        .split(new RegExp(/\s+/))
      /* delete empty entries */
        .join(',')
        .replace(/,,+/g, ',')
        .split(','),
        move = '';

      for (let half_move = 0; half_move < moves.length - 1; half_move++) {
        move = move_from_san(moves[half_move], sloppy);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position) */
        if (move == null) { return false; }
        else { make_move(move); }
      }

      /* examine last move */
      move = moves[moves.length - 1];
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') 
          set_header(['Result', move]);
      } else {
        move = move_from_san(move, sloppy);
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }
      return true;
    },
    header: (...args) => set_header(args),
    move: function(move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      let sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
        ? options.sloppy
        : false,

      move_obj = null;

      if (typeof move === 'string') {
        move_obj = move_from_san(move, sloppy);
      } else if (typeof move === 'object') {
        let moves = generate_moves();

        /* convert the pretty move object to an ugly move object */
        for (let i = 0, len = moves.length; i < len; i++) 
          if (
            move.from === algebraic(moves[i].from) &&
            move.to === algebraic(moves[i].to) &&
            (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)
          ) {
            move_obj = moves[i];
            break;
          }
      }

      /* failed to find move */
      if (!move_obj) return null;

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      let pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move;
    },
    undo: function() {
      let move = undo_move();
      return move ? make_pretty(move) : null;
    },
    square_color: function(square) {
      if (square in SQUARES) {
        let sq_0x88 = SQUARES[square];
        return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark';
      }

      return null;
    },
    history: function(options) {
      let reversed_history = [],
      move_history = [],
      verbose =
        typeof options !== 'undefined' &&
        'verbose' in options &&
        options.verbose;

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        let move = reversed_history.pop();
        move_history.push(
          (verbose ? make_pretty : move_to_san)(move)
        );
        make_move(move);
      }

      return move_history;
    }
  }
}

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined')
  define(function() {
    return Chess
  })

new Position('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1');
