from iconservice import *

TAG = 'UseInterface'

class SampleInterface(InterfaceScore):
    @interface
    def getOwnerName(self):
        pass

class UseInterface(IconScoreBase):
    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)

    def on_install(self) -> None:
        super().on_install()

    def on_update(self) -> None:
        super().on_update()

    @external(readonly=True)
    def getOwnerName(self) -> str:
        interface = self.create_interface_score(Address.from_string("cxac2cb26b1ddc2eec3e3de05cb1030786d4a1083e"), SampleInterface)
        return interface.getOwnerName()
