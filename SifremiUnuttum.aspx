<%@ Page Title="Şifremi Unuttum - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="SifremiUnuttum.aspx.cs" Inherits="SifremiUnuttum" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/auth.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-header">
                <h2 class="auth-title">Şifremi Unuttum</h2>
                <p class="auth-subtitle">E-posta adresinizi girin ve şifre sıfırlama bağlantısı alın.</p>
            </div>
            
            <div class="auth-body">
                <asp:Panel ID="pnlResetForm" runat="server">
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
                        <asp:Button ID="btnResetPassword" runat="server" Text="Şifre Sıfırlama Bağlantısı Gönder" CssClass="auth-submit-btn" OnClick="btnResetPassword_Click" />
                    </div>
                    
                    <asp:Panel ID="pnlResetError" runat="server" CssClass="auth-error-message" Visible="false">
                        <i class="fas fa-exclamation-circle"></i>
                        <asp:Literal ID="litErrorMessage" runat="server"></asp:Literal>
                    </asp:Panel>
                </asp:Panel>
                
                <asp:Panel ID="pnlResetSuccess" runat="server" CssClass="auth-success-message" Visible="false">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 class="success-title">Şifre Sıfırlama E-postası Gönderildi</h3>
                    <p class="success-message">
                        <asp:Literal ID="litSuccessEmail" runat="server"></asp:Literal> adresine bir şifre sıfırlama bağlantısı gönderdik. 
                        Lütfen e-posta gelen kutunuzu kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
                    </p>
                    <p class="success-note">
                        E-posta birkaç dakika içinde gelmezse, lütfen spam klasörünüzü kontrol edin veya tekrar deneyin.
                    </p>
                    <div class="success-actions">
                        <a href="Login.aspx" class="auth-link-btn">Giriş Sayfasına Dön</a>
                        <button type="button" id="resendEmailBtn" class="auth-link-btn-secondary">E-postayı Tekrar Gönder</button>
                    </div>
                </asp:Panel>
            </div>
            
            <div class="auth-footer">
                <p>Şifrenizi hatırladınız mı? <a href="Login.aspx" class="auth-link">Giriş Yapın</a></p>
                <p>Hesabınız yok mu? <a href="Register.aspx" class="auth-link">Hesap Oluşturun</a></p>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/sidebar.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Tekrar gönder butonuna tıklandığında
            const resendEmailBtn = document.getElementById('resendEmailBtn');
            if (resendEmailBtn) {
                resendEmailBtn.addEventListener('click', function() {
                    // Butonu devre dışı bırak ve bekliyor göster
                    this.disabled = true;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
                    
                    // 2 saniye sonra tekrar etkinleştir (gerçek uygulamada bu işlem sunucu tarafında yapılacak)
                    setTimeout(() => {
                        this.disabled = false;
                        this.innerHTML = 'E-postayı Tekrar Gönder';
                        
                        // Başarı mesajı göster
                        alert('Şifre sıfırlama e-postası tekrar gönderildi. Lütfen gelen kutunuzu kontrol edin.');
                    }, 2000);
                });
            }
        });
    </script>
</asp:Content>
