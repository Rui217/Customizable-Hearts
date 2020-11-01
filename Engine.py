from random import shuffle

class Card:
    """
    Fields: value (Str), suit (Str), rank (Int), points (Int)
    """
    def __init__(self, value, suit, rank, order, points = 0):
        self.value = value #"two", ..., "jack", "queen", "king", "ace"
        self.suit = suit # "hearts", "spades", "diamonds", "clubs"
        self.rank = rank # 1 < 2 < 3 < ... < 14
        self.order = order
        self.points = points

C2 = Card("two", "clubs", 2, 2)
C3 = Card("three", "clubs", 3, 3)
C4 = Card("four", "clubs", 4, 4)
C5 = Card("five", "clubs", 5, 5)
C6 = Card("six", "clubs", 6, 6)
C7 = Card("seven", "clubs", 7, 7)
C8 = Card("eight", "clubs", 8, 8)
C9 = Card("nine", "clubs", 9, 9)
C10 = Card("ten", "clubs", 10, 10)
CJ = Card("jack", "clubs", 11, 11)
CQ = Card("queen", "clubs", 12, 12)
CK = Card("king", "clubs", 13, 13)
CA = Card("ace", "clubs", 14, 14)

D2 = Card("two", "diamonds", 2, 102)
D3 = Card("three", "diamonds", 3, 103)
D4 = Card("four", "diamonds", 4, 104)
D5 = Card("five", "diamonds", 5, 105)
D6 = Card("six", "diamonds", 6, 106)
D7 = Card("seven", "diamonds", 7, 107)
D8 = Card("eight", "diamonds", 8, 108)
D9 = Card("nine", "diamonds", 9, 109)
D10 = Card("ten", "diamonds", 10, 110)
DJ = Card("jack", "diamonds", 11, 111, 0) # 0, -10
DQ = Card("queen", "diamonds", 12, 112)
DK = Card("king", "diamonds", 13, 113)
DA = Card("ace", "diamonds", 14, 114)

S2 = Card("two", "spades", 2, 202)
S3 = Card("three", "spades", 3, 203)
S4 = Card("four", "spades", 4, 204)
S5 = Card("five", "spades", 5, 205)
S6 = Card("six", "spades", 6, 206)
S7 = Card("seven", "spades", 7, 207)
S8 = Card("eight", "spades", 8, 208)
S9 = Card("nine", "spades", 9, 209)
S10 = Card("ten", "spades", 10, 210)
SJ = Card("jack", "spades", 11, 211)
SQ = Card("queen", "spades", 12, 212, 13) # 13, 0
SK = Card("king", "spades", 13, 213)
SA = Card("ace", "spades", 14, 214)

H2 = Card("two", "hearts", 2, 302, 1)
H3 = Card("three", "hearts", 3, 303, 1)
H4 = Card("four", "hearts", 4, 304, 1)
H5 = Card("five", "hearts", 5, 305, 1)
H6 = Card("six", "hearts", 6, 306, 1)
H7 = Card("seven", "hearts", 7, 307, 1)
H8 = Card("eight", "hearts", 8, 308, 1)
H9 = Card("nine", "hearts", 9, 309, 1)
H10 = Card("ten", "hearts", 10, 310, 1)
HJ = Card("jack", "hearts", 11, 311, 1)
HQ = Card("queen", "hearts", 12, 312, 1)
HK = Card("king", "hearts", 13, 313, 1)
HA = Card("ace", "hearts", 14, 314, 1)

card = {
    "2C" : C2, 
    "3C" : C3, 
    "4C" : C4, 
    "5C" : C5, 
    "6C" : C6, 
    "7C" : C7, 
    "8C" : C8, 
    "9C" : C9, 
    "10C" : C10, 
    "JC" : CJ, 
    "QC" : CQ, 
    "KC" : CK, 
    "AC" : CA, 
    "2D" : D2, 
    "3D" : D3, 
    "4D" : D4, 
    "5D" : D5, 
    "6D" : D6, 
    "7D" : D7, 
    "8D" : D8, 
    "9D" : D9, 
    "10D" : D10, 
    "JD" : DJ, 
    "QD" : DQ, 
    "KD" : DK, 
    "AD" : DA, 
    "2S" : S2, 
    "3S" : S3, 
    "4S" : S4, 
    "5S" : S5, 
    "6S" : S6, 
    "7S" : S7, 
    "8S" : S8, 
    "9S" : S9, 
    "10S" : S10, 
    "JS" : SJ, 
    "QS" : SQ, 
    "KS" : SK, 
    "AS" : SA, 
    "2H" : H2, 
    "3H" : H3, 
    "4H" : H4, 
    "5H" : H5, 
    "6H" : H6, 
    "7H" : H7, 
    "8H" : H8, 
    "9H" : H9, 
    "10H" : H10, 
    "JH" : HJ, 
    "QH" : HQ, 
    "KH" : HK, 
    "AH" : HA}

deck = ["2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC", 
        "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD", 
        "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS", 
        "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH"]

# default options
players = 4
target_score = 100
first_trick_no_points = True
passing_pattern = "left, right, across, hold"
black_lady = True # queen of spades is worth 13
jack_of_diamonds_variation = False # jack of diamonds variation, 0 or -10
dj_the_moon = False # require jack of diamonds to shoot the moon
shooting_the_moon = True
new_moon = False # False, "always", "choice", "if necessary"
shooting_the_sun = False

# customization
while True:
    try:
        response = input("3, 4, 5, or 6 players?\n  ")
        if response == "3":
            deck.remove("3C")
            players = 3
            break
        if response == "4":
            players = 4
            break
        if response == "5":
            players = 5
            deck.remove("3C")
            deck.remove("2D")
            break
        if response == "6":
            players = 6
            deck.remove("4C")
            deck.remove("3C")
            deck.remove("2D")
            deck.remove("2S")
            break
        print("  Error: response must be \"3\", \"4\", \"5\", or \"6\"\n")
    except Exception:
        print("  Error: unknown\n")
        
while True:
    try:
        response = input("\nPlay until how many points?\n  ")
        if int(response) > 0:
            target_score = int(response)
            break
        else:
            print("  Error: response must be a positive integer\n")
    except Exception:
        print("  Error: response must be a positive integer\n")

while True:
    try:
        response = input("\nPoints cards not allowed on first trick? (\"yes\" or \"no\")\n  ")
        if response == "yes":
            first_trick_no_points = True
            break
        if response == "no":
            first_trick_no_points = False
            break
        print("  Error: response must be \"yes\" or \"no\"\n")
    except Exception:
        print("  Error: unknown\n")  
        
while True:
    try:
        print("\nPassing pattern? Options:")
        print("none")
        '''
        if players == 4:
            print("left, right, across, hold")
            print("left, right, across")
        print("left, right")
        print("left")
        print("right")
        print("centre mixer")
        print("rotating pass")
        '''
        response = input("  ")
        if response == "none":
            passing_pattern = "none"
            break
        print("  Error: response must be one of the options\n")
    except Exception:
        print("  Error: unknown\n")  
        

'''
while True:
    try:
        input()
    except Exception:
        print("  Error: unknown\n")    
'''

hand = []
score = []
round_number = 1

for i in range(players):
    hand.append([])
    score.append(0)

# determine threshold for shooting the moon
moon_threshold = 0
for playing_card in deck:
    if card[playing_card].points > 0:
        moon_threshold += card[playing_card].points


# loop for all rounds in a game
while max(score) < target_score:
    
    # shuffle and deal cards
    shuffle(deck)
    for i in range(len(deck)):
        hand[i % players].append(deck[i])
        
    # passing cards
        
    # initialization
    round_score = []
    won_cards = []
    hearts_broken = False
    suit = "clubs"
    trick_number = 1
    trick_winner = -1
    for player in range(players):
        round_score.append(0)
        won_cards.append([])
        hand[player].sort(key = lambda playing_card: card[playing_card].order, reverse = True)
        if "2C" in hand[player]: # two of clubs goes first
            trick_winner = player
    
    
    # loop for all tricks in a round
    while len(hand[0]) > 0:
        
        # initialization
        table = []
        for player in range(players):
            table.append("")
        print("Trick {0}:".format(trick_number))
        
        # every player takes a turn
        for i in range(players):
            playing_player = (trick_winner + i) % players
            
            # if player has more than one card
            if len(hand[playing_player]) > 1:
                
                # determine if player has a club and/or a card without points
                has_2C = False
                has_suit = False
                has_non_heart = False
                has_pointless = False
                for j in range(len(hand[playing_player])):
                    if hand[playing_player][j] == "2C": # two of clubs goes first
                        has_2C = True
                        break
                    if card[hand[playing_player][j]].suit == suit:
                        has_suit = True
                    if card[hand[playing_player][j]].suit != "hearts":
                        has_non_heart = True
                    if card[hand[playing_player][j]].points == 0:
                        has_pointless = True
                
                # determine which card to play
                while True:
                    
                    # two of clubs must be played first
                    if has_2C:
                        play = "2C"
                        suit = "clubs"
                        break
                    
                    # ask player to choose a card and determine if choice is valid
                    try:
                        play = input("    Player {0}: Play one of the following cards\n    {1}\n    "\
                                     .format(playing_player, hand[playing_player]))
                        if play not in hand[playing_player]:
                            print("    Error: card not in hand")
                        
                        # trick_winner selects leading card
                        elif trick_winner == playing_player:
                            if card[play].suit == "hearts" and not hearts_broken and has_non_heart:
                                print("    Error: hearts are not broken yet")
                            else:
                                suit = card[play].suit
                                break
                        
                        # other players must follow suit if possible
                        elif card[play].suit != suit and has_suit:
                            print("    Error: must play a {0}".format(suit[:-1]))
                        elif trick_number == 1 and has_pointless and first_trick_no_points and card[play].points:
                            print("    Error: cannot play a card with points on the first trick")
                        else:
                            break
                    except Exception:
                        print("    Error: unknown")
                    print()
                    
            # if player has only one card (i.e. no choice)
            else:
                play = hand[playing_player][0]
                if trick_winner == playing_player:
                    suit = card[play].suit
                
            # player removes card from their hand and places it on the table
            table[playing_player] = play
            hand[playing_player].remove(play)
            print("Player {0} plays {1}".format(playing_player, card[play].value + " of " + card[play].suit))
        
        # determine who won the trick 
        highest = -1
        total_points = 0
        
        for i in range(len(table)):
            if card[table[i]].suit == suit and card[table[i]].rank > highest:
                highest = card[table[i]].rank
                trick_winner = i
            if card[table[i]].suit == "hearts" or (table[i] == "QS" and black_lady):
                hearts_broken = True # check if hearts were broken
            total_points += card[table[i]].points
        
        won_cards[trick_winner] += table # add trick to their won cards
        print("Player {0} wins the trick\n".format(trick_winner))
        trick_number += 1
    
    
    # determine scoring for this round
    for player in range(players):
        
        # check if player shot the sun
        if shooting_the_sun and len(won_cards[player]) == len(deck):
            
            # check if jack of diamonds is required to shoot the sun
            if jack_of_diamonds_variation and not dj_the_moon:
                round_score[player] += DJ.points
            
            # determine which type of sun to shoot
            sun_type = "" 
            
            if new_moon == "always":
                sun_type = "new"
                
            elif new_moon == "choice":
                while True:
                    try:
                        choice = input("    Player {0}: Would you like to shoot the new sun? (\"yes\" or \"no\")\n  ".format(player))
                        if choice == "yes":
                            sun_type = "new"
                            break
                        if choice == "no":
                            sun_type = "old"
                            break
                        print("    Error: response must be \"yes\" or \"no\"")
                    except Exception:
                        print("    Error: unknown")
                    print()
                    
            elif new_moon == "if necessary":
                
                # determine score if player hypothetically shoots old sun
                test_score = []
                for j in range(players):
                    test_score.append(0)
                    if j != player:
                        test_score[j] = score[j] + 52
                    else:
                        test_score[j] = score[j] + round_score[j] # dj_the_moon
                
                # check if player would lose by hypothetically shooting the old sun
                shooter_score = test_score.pop(player)
                if max(test_score) >= target_score and shooter_score >= min(test_score):
                    sun_type = "new"
                else:
                    sun_type = "old"
                    
            else:
                sun_type = "old"
            
            print("Player {0} has shot the {1} sun!!!".format(player, sun_type))
            
            # determine score change based on type of sun shot
            if sun_type == "new":
                round_score[player] += -52
            else:
                for j in range(players):
                    if j != player:
                        round_score[j] += 52
        
        else:
            
            # determine if player shot the moon
            moon_test = 0
            moon_shot = False
            has_dj = False
            
            for playing_card in won_cards[player]:
                if card[playing_card].points > 0:
                    moon_test += card[playing_card].points
                if playing_card == "JD":
                    has_dj = True
            
            if moon_test == moon_threshold:
                if jack_of_diamonds_variation and dj_the_moon:
                    moon_shot = has_dj
                else:
                    moon_shot = True
            
            if shooting_the_moon and moon_shot:
                
                # check if jack of diamonds is required to shoot the moon
                if jack_of_diamonds_variation and not dj_the_moon:
                    round_score[player] += DJ.points
                
                # determine which type of moon to shoot
                moon_type = "" 
                
                if new_moon == "always":
                    moon_type = "new"
                    
                elif new_moon == "choice":
                    while True:
                        try:
                            choice = input("    Player {0}: Would you like to shoot the new moon? (\"yes\" or \"no\")\n  ".format(player))
                            if choice == "yes":
                                moon_type = "new"
                                break
                            if choice == "no":
                                moon_type = "old"
                                break
                            print("    Error: response must be \"yes\" or \"no\"")
                        except Exception:
                            print("    Error: unknown")
                        print()
                        
                elif new_moon == "if necessary":
                    
                    # determine score if player hypothetically shoots old moon
                    test_score = []
                    for j in range(players):
                        test_score.append(0)
                        if j != player:
                            test_score[j] = score[j] + 26
                        else:
                            test_score[j] = score[j] + round_score[j] # dj_the_moon
                    
                    # check if player would lose by hypothetically shooting the old moon
                    shooter_score = test_score.pop(player)
                    if max(test_score) >= target_score and shooter_score >= min(test_score):
                        moon_type = "new"
                    else:
                        moon_type = "old"
                        
                else:
                    moon_type = "old"
                
                print("Player {0} has shot the {1} moon!".format(player, moon_type))
                
                # update score based on type of moon shot
                if moon_type == "new":
                    round_score[player] += -26
                else:
                    for j in range(players):
                        if j != player:
                            round_score[j] += 26
                            
            # otherwise determine score change as usual
            else:
                for playing_card in won_cards[player]:
                    round_score[player] += card[playing_card].points
    
        # filter and sort points cards that each player obtained
        temp_cards = []        
        for playing_card in won_cards[player]:
            if card[playing_card].points:
                temp_cards.append(playing_card)
        temp_cards.sort(key = lambda playing_card: card[playing_card].order, reverse = True)
        won_cards[player] = temp_cards.copy()
        
    
    # update scores for this round
    print("----------------------------------------------------------")
    print("Round {0} scores:".format(round_number))
    for player in range(players):
        score_change = ""
        if round_score[player] >= 0:
            score_change = "+"
        score_change += str(round_score[player])
        print("  Player {0}: {1} -> {2} ({3}) ".format(player, score[player], 
                                                      score[player] + round_score[player], 
                                                      score_change), end = "")
        if len(won_cards[player]) > 0:
            print(won_cards[player])
        else:
            print()
        score[player] += round_score[player]
    print("----------------------------------------------------------")
    round_number += 1


# determine who won after game is over
winning_score = min(score)
winners = []
for player in range(players):
    if score[player] == winning_score:
        winners.append(player)

# if there is only one winner
if len(winners) == 1:
    print("Player {0} wins!".format(winners[0]))

# if there is a tie
else:
    print("Players {0}, ".format(winners[0]), end = "")
    for player in range(1, len(winners) - 1):
        print("{0}, ".format(winners[i]), end = "")
    print("and {0} win!".format(winners[-1]))