import { Button, Component, EditBox, find, Toggle, ToggleContainer } from "cc";
import { LobbyController } from "./LobbyController";

export class ChangeUserInfoView extends Component {

    private _nickNameEditBox: EditBox
    private _avatorEditBox: EditBox
    private _genderToggleGroup: ToggleContainer
    private _btnClose: Button
    private _btnChange: Button

    onLoad() {
        this._nickNameEditBox = find("NickName", this.node).getComponent(EditBox)
        this._avatorEditBox = find("Avatar", this.node).getComponent(EditBox)
        this._genderToggleGroup = find("Gender", this.node).getComponent(ToggleContainer)
        this._btnChange = find("ButtonChange", this.node).getComponent(Button)
        this._btnClose = find("ButtonClose", this.node).getComponent(Button)
    }

    onEnable() {
        this._btnClose.node.on('click', () => this.buttonCloseClick())
        this._btnChange.node.on('click', () => this.buttonChangeNickNameClick())
    }

    onDisable() {
        this._btnClose.node.off('click', () => this.buttonCloseClick())
        this._btnChange.node.off('click', () => this.buttonChangeNickNameClick())
    }


    //这里只做了更换nickname, 其它的如更换性别，更换头像，类似，可自行完成
    private buttonChangeNickNameClick() {
        LobbyController.ChangeNickName(this._nickNameEditBox.string)
        this.node.active = false
    }

    private async buttonCloseClick() {
        this.node.active = false
    }
}