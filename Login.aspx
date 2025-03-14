<%@ Page Title="Giriş Yap - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/auth.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-header">
                <h2 class="auth-title">Giriş Yap</h2>
                <p class="auth-subtitle">Senirkent Blog'a hoş geldiniz! Hesabınıza giriş yapın.</p>
            </div>
            
            <div class="auth-body">
                <div class="form-group">
                    <asp:Label ID="lblEmail" runat="server" Text="E-posta Adresi" AssociatedControlID="txtEmail" CssClass="form-label"></asp:Label>
                    <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" placeholder="E-posta adresinizi girin" TextMode="Email"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="reqEmail" runat="server" 
                        ControlToValidate="txtEmail" 
                        ErrorMessage="E-posta adresi gereklidir." 
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RequiredFieldValidator>
                </div>
                
                <div class="form-group">
                    <div class="password-label-container">
                        <asp:Label ID="lblPassword" runat="server" Text="Şifre" AssociatedControlID="txtPassword" CssClass="form-label"></asp:Label>
                        <a href="SifremiUnuttum.aspx" class="forgot-password-link">Şifremi Unuttum</a>
                    </div>
                    <div class="password-input-container">
                        <asp:TextBox ID="txtPassword" runat="server" CssClass="form-control" placeholder="Şifrenizi girin" TextMode="Password"></asp:TextBox>
                        <button type="button" class="password-toggle-btn" id="passwordToggle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <asp:RequiredFieldValidator ID="reqPassword" runat="server" 
                        ControlToValidate="txtPassword" 
                        ErrorMessage="Şifre gereklidir." 
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RequiredFieldValidator>
                </div>
                
                <div class="remember-me-container">
                    <asp:CheckBox ID="chkRememberMe" runat="server" CssClass="remember-me-checkbox" />
                    <asp:Label ID="lblRememberMe" runat="server" Text="Beni Hatırla" AssociatedControlID="chkRememberMe" CssClass="remember-me-label"></asp:Label>
                </div>
                
                <div class="form-group">
                    <asp:Button ID="btnLogin" runat="server" Text="Giriş Yap" CssClass="auth-submit-btn" OnClick="btnLogin_Click" />
                </div>
                
                <asp:Panel ID="pnlLoginError" runat="server" CssClass="auth-error-message" Visible="false">
                    <i class="fas fa-exclamation-circle"></i>
                    <asp:Literal ID="litErrorMessage" runat="server"></asp:Literal>
                </asp:Panel>
            </div>
            
            <div class="auth-separator">
                <span>veya</span>
            </div>
            
            <div class="social-login">
                <button type="button" class="social-login-btn google-btn">
                    <i class="fab fa-google"></i> Google ile Giriş Yap
                </button>
                <button type="button" class="social-login-btn facebook-btn">
                    <i class="fab fa-facebook-f"></i> Facebook ile Giriş Yap
                </button>
            </div>
            
            <div class="auth-footer">
                <p>Henüz hesabınız yok mu? <a href="Register.aspx" class="auth-link">Hesap Oluştur</a></p>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/sidebar.js"></script>
    <script src="Scripts/auth.js"></script>
</asp:Content>
