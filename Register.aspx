<%@ Page Title="Kayıt Ol - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="Register" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/auth.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-header">
                <h2 class="auth-title">Hesap Oluştur</h2>
                <p class="auth-subtitle">Senirkent Blog'a kaydolarak yazıları paylaşmaya ve yorum yapmaya başlayın.</p>
            </div>
            
            <div class="auth-body">
                <div class="form-group">
                    <asp:Label ID="lblName" runat="server" Text="Ad Soyad" AssociatedControlID="txtName" CssClass="form-label"></asp:Label>
                    <asp:TextBox ID="txtName" runat="server" CssClass="form-control" placeholder="Adınızı ve soyadınızı girin"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="reqName" runat="server" 
                        ControlToValidate="txtName" 
                        ErrorMessage="Ad soyad gereklidir." 
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RequiredFieldValidator>
                </div>
                
                <div class="form-group">
                    <asp:Label ID="lblEmail" runat="server" Text="E-posta Adresi" AssociatedControlID="txtEmail" CssClass="form-label"></asp:Label>
                    <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" placeholder="E-posta adresinizi girin" TextMode="Email"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="reqEmail" runat="server" 
                        ControlToValidate="txtEmail" 
                        ErrorMessage="E-posta adresi gereklidir." 
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RequiredFieldValidator>
                    <asp:RegularExpressionValidator ID="regEmail" runat="server" 
                        ControlToValidate="txtEmail"
                        ErrorMessage="Geçerli bir e-posta adresi girin." 
                        ValidationExpression="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RegularExpressionValidator>
                </div>
                
                <div class="form-group">
                    <asp:Label ID="lblPassword" runat="server" Text="Şifre" AssociatedControlID="txtPassword" CssClass="form-label"></asp:Label>
                    <div class="password-input-container">
                        <asp:TextBox ID="txtPassword" runat="server" CssClass="form-control" placeholder="En az 6 karakter uzunluğunda bir şifre girin" TextMode="Password"></asp:TextBox>
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
                    <asp:RegularExpressionValidator ID="regPassword" runat="server" 
                        ControlToValidate="txtPassword"
                        ErrorMessage="Şifre en az 6 karakter uzunluğunda olmalıdır." 
                        ValidationExpression=".{6,}"
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RegularExpressionValidator>
                </div>
                
                <div class="form-group">
                    <asp:Label ID="lblConfirmPassword" runat="server" Text="Şifreyi Onaylayın" AssociatedControlID="txtConfirmPassword" CssClass="form-label"></asp:Label>
                    <div class="password-input-container">
                        <asp:TextBox ID="txtConfirmPassword" runat="server" CssClass="form-control" placeholder="Şifrenizi tekrar girin" TextMode="Password"></asp:TextBox>
                        <button type="button" class="password-toggle-btn" id="confirmPasswordToggle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <asp:RequiredFieldValidator ID="reqConfirmPassword" runat="server" 
                        ControlToValidate="txtConfirmPassword" 
                        ErrorMessage="Şifre onayı gereklidir." 
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:RequiredFieldValidator>
                    <asp:CompareValidator ID="cmpPassword" runat="server" 
                        ControlToValidate="txtConfirmPassword"
                        ControlToCompare="txtPassword"
                        ErrorMessage="Şifreler eşleşmiyor." 
                        CssClass="validator-message" 
                        Display="Dynamic">
                    </asp:CompareValidator>
                </div>
                
                <div class="terms-condition-container">
                    <asp:CheckBox ID="chkTerms" runat="server" CssClass="terms-checkbox" />
                    <asp:Label ID="lblTerms" runat="server" AssociatedControlID="chkTerms" CssClass="terms-label">
                        <a href="Kosullar.aspx" class="terms-link" target="_blank">Kullanım Koşulları</a>'nı ve
                        <a href="Gizlilik.aspx" class="terms-link" target="_blank">Gizlilik Politikası</a>'nı kabul ediyorum.
                    </asp:Label>
                    <asp:CustomValidator ID="valTerms" runat="server" 
                        ClientValidationFunction="ValidateTerms"
                        ErrorMessage="Kullanım koşullarını ve gizlilik politikasını kabul etmelisiniz." 
                        CssClass="validator-message" 
                        Display="Dynamic" 
                        OnServerValidate="valTerms_ServerValidate">
                    </asp:CustomValidator>
                </div>
                
                <div class="form-group">
                    <asp:Button ID="btnRegister" runat="server" Text="Kayıt Ol" CssClass="auth-submit-btn" OnClick="btnRegister_Click" />
                </div>
                
                <asp:Panel ID="pnlRegisterError" runat="server" CssClass="auth-error-message" Visible="false">
                    <i class="fas fa-exclamation-circle"></i>
                    <asp:Literal ID="litErrorMessage" runat="server"></asp:Literal>
                </asp:Panel>
                
                <asp:Panel ID="pnlRegisterSuccess" runat="server" CssClass="auth-success-message" Visible="false">
                    <i class="fas fa-check-circle"></i>
                    <asp:Literal ID="litSuccessMessage" runat="server"></asp:Literal>
                </asp:Panel>
            </div>
            
            <div class="auth-separator">
                <span>veya</span>
            </div>
            
            <div class="social-login">
                <button type="button" class="social-login-btn google-btn">
                    <i class="fab fa-google"></i> Google ile Kaydol
                </button>
                <button type="button" class="social-login-btn facebook-btn">
                    <i class="fab fa-facebook-f"></i> Facebook ile Kaydol
                </button>
            </div>
            
            <div class="auth-footer">
                <p>Zaten bir hesabınız var mı? <a href="Login.aspx" class="auth-link">Giriş Yapın</a></p>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/sidebar.js"></script>
    <script src="Scripts/auth.js"></script>
    <script type="text/javascript">
        function ValidateTerms(source, args) {
            args.IsValid = document.getElementById('<%= chkTerms.ClientID %>').checked;
        }
    </script>
</asp:Content>
