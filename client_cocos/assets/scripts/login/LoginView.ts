import { Button, Component, director, EditBox, find, _decorator } from "cc";
import { LoginController } from "./LoginController";

const { ccclass, property } = _decorator;


/**
 * 客户端从login开始，整个客户端没用什么框架，写得比较简单
 */

@ccclass("LoginView")
export class LoginView extends Component {

    private _editBoxAccount: EditBox
    private _editBoxPassword: EditBox
    private _buttonRegister: Button
    private _buttonLogin: Button

    public onLoad() {
        this._editBoxAccount = find("EditBox_Account", this.node).getComponent(EditBox);
        this._editBoxPassword = find("EditBox_Password", this.node).getComponent(EditBox);
        this._buttonRegister = find("Button_Register", this.node).getComponent(Button);
        this._buttonLogin = find("Button_Login", this.node).getComponent(Button);
    }

    public start() {
        LoginController.Start()
        this.refreshAccountAndPassword()
    }

    public onEnable() {
        this._buttonLogin.node.on('click', () => { this.buttonLoginClick() })
        this._buttonRegister.node.on('click', () => this.buttonRegisterClick())
    }

    public onDisable() {
        this._buttonLogin.node.off('click', () => { this.buttonLoginClick() })
        this._buttonRegister.node.off('click', () => this.buttonRegisterClick())
    }


    private refreshAccountAndPassword() {
        this._editBoxAccount.string = ""
        this._editBoxPassword.string = ""
        if (localStorage.getItem("account") != undefined) {
            this._editBoxAccount.string = localStorage.getItem("account")
        }
        if (localStorage.getItem("password") != undefined) {
            this._editBoxPassword.string = localStorage.getItem("password")
        }
    }



    private async buttonLoginClick() {
        localStorage.setItem("account", this._editBoxAccount.string)
        localStorage.setItem("password", this._editBoxPassword.string)
        await LoginController.OnLogin(this._editBoxAccount.string, this._editBoxPassword.string)
        await LoginController.OnConnectorAuth()
        director.loadScene("lobby", (err, scene) => {
            if (err != null) {
                return
            }
        })
    }

    private async buttonRegisterClick() {
        localStorage.setItem("account", this._editBoxAccount.string)
        localStorage.setItem("password", this._editBoxPassword.string)
        await LoginController.OnRegister(this._editBoxAccount.string, this._editBoxPassword.string)
    }

}