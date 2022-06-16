import { Button, Component, find, game, instantiate, Label, Layout, SystemEvent, _decorator } from "cc";
import { E_GameType } from "../define/Enum";
import EventBus from "../define/EventBus";
import { Session } from "../login/LoginModel";
import { ChangeUserInfoView } from "./ChangeUserInfoView";
import { LobbyController as LobbyController } from "./LobbyController";

const { ccclass, property } = _decorator;

@ccclass("LobbyView")
export class LobbyView extends Component {




    private _labelNickName: Label
    private _labelId: Label
    private _labelGold: Label
    private _buttonChange: Button
    private changeUserInfo: ChangeUserInfoView

    //生命周期函数
    public onLoad() {
      
        this._buttonChange = find("UserInfo/ButtonChange", this.node).getComponent(Button);
        this._labelNickName = find("UserInfo/NickName", this.node).getComponent(Label);
        this._labelId = find("UserInfo/Id", this.node).getComponent(Label);
        this._labelGold = find("UserInfo/Gold", this.node).getComponent(Label);


        this._buttonChange.node.on('click', () => this.buttonChangeNickNameClick())
        this.changeUserInfo = find("ChangeUserInfo", this.node).addComponent(ChangeUserInfoView);
        this.changeUserInfo.node.active = false

        this.refreshGameList();
    }

    //生命周期函数
    public onEnable() {
        EventBus.eventTarget.addEventListener("LobbyView.refreshNickName", () => this.refreshNickName())
        EventBus.eventTarget.addEventListener("LobbyView.refreshUserInfo", () => this.refreshUserInfo())
    }

    //生命周期函数
    public start() {
        LobbyController.Start();
      
    }

    //生命周期函数
    public onDisable() {
        EventBus.eventTarget.removeEventListener("LobbyView.refreshNickName", () => this.refreshNickName())
        EventBus.eventTarget.removeEventListener("LobbyView.refreshUserInfo", () => this.refreshUserInfo())
    }

    private refreshGameList() {
        let gameList = [
            { name: "中国象棋", id: 10001, },
            { name: "五子棋", id: 10002, }
        ]

        let btnItem = find("GameList/Button_Game", this.node)
        let layOut = find("GameList", this.node).getComponent(Layout)
        gameList.forEach(gameInfo => {
            let item = instantiate(btnItem);
            layOut.node.addChild(item);
            let label = find("Label", item).getComponent(Label)
            label.string = gameInfo.name
            item.on("click", () => {
                console.log(`按钮名称为:${gameInfo.name},按钮Id为：${gameInfo.id}`)
            })
        })

        btnItem.active = false
    }


    private async buttonChangeNickNameClick() {
        this.changeUserInfo.node.active = true
    }

    private async refreshUserInfo() {

        console.log("refreshUserInfo")

        this.refreshNickName();
        this.refreshId();
        this.refreshGold();

        //todo refreshAvatar()  refreshGender()
    }

    public refreshNickName() {
        this._labelNickName.string = '呢称:' + Session.userInfo.nickName
    }

    public refreshGold() {
        this._labelGold.string = '金币:' + Session.userInfo.gold
    }

    public refreshId() {
        this._labelId.string = 'Id:' + Session.userInfo.uid
    }
}