#from iconservice import *
# from .customizedclass import DataHandlingClass


class Sample(IconScoreBase):

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)
        self._db = db
        # self._sample_class = DictDB('sample_class_db', db, value_type=str)

    def on_install(self) -> None:
        super().on_install()

    def on_update(self) -> None:
        super().on_update()

    def _get_random(self, data: str):
        input_data = f'{self.block.timestamp}, {data}'.encode()
        hash = sha3_256(input_data)
        return int.from_bytes(hash, 'big')

    #def _dice_roll_and_save(self, number: int, data: str):
        # data_handling_class = DataHandlingClass(attr1=number, attr2=data)
        # self._sample_class['customized_class'] = str(data_handling_class)


    @external(readonly=True)
    def example_class_type(self) -> str:
        # data_handling_class_str = self._sample_class['customized_class']
        data_handling_class_dict = json_loads(data_handling_class_str)
        # data_handling_class = DataHandlingClass(data_handling_class_dict['attr1'], data_handling_class_dict['attr2'])
        return str(type(data_handling_class))

    @external
    @payable
    def diceRoll(self, data: str) -> int:
        magic_number =  self._get_random(data) % 6
        betAmount = self.msg.value
        _dice_roll_and_save(magic_number, data)
        if (magic_number >= 3):
            icx.transfer(self.msg.sender, betAmount * 2)
        return magic_number

