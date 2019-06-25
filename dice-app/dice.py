from iconservice import *

class Dice(IconScoreBase):

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)

    def on_install(self) -> None:
        super().on_install()

    def on_update(self) -> None:
        super().on_update()

    def _get_random_number(self, input:str):
        input_with_timestamp = f'{self.block.timestamp}, {input}'.encode()
        hash = sha3_256(input_with_timestamp)
        return int.from_bytes(hash, 'big')

    @external
    def startGame(self, input:str) -> (str):
        diceNumber =  self._get_random_number(input) % 6 + 1
        if (diceNumber == 6):
            self.diceResult(diceNumber, True)
        else:
            self.diceResult(diceNumber, False)

    @eventlog(indexed=2)
    def diceResult(self, myNumber: int, win: bool): pass