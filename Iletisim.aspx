<%@ Page Title="İletişim - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Iletisim.aspx.cs" Inherits="Iletisim" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/contact.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="contact-container">
        <div class="contact-header">
            <h2 class="contact-title">İletişim</h2>
            <p class="contact-desc">Bizimle iletişime geçmek için aşağıdaki formu doldurabilir veya sosyal medya hesaplarımızı takip edebilirsiniz.</p>
        </div>
        
        <div class="contact-content">
            <div class="contact-form-section">
                <h3>Bize Ulaşın</h3>
                <div class="contact-form">
                    <div class="form-group">
                        <asp:Label ID="lblName" runat="server" Text="Adınız Soyadınız" AssociatedControlID="txtName"></asp:Label>
                        <asp:TextBox ID="txtName" runat="server" CssClass="form-control" placeholder="Adınız Soyadınız"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reqName" runat="server" 
                            ControlToValidate="txtName" 
                            ErrorMessage="Adınız ve soyadınız gereklidir." 
                            CssClass="validator-message" 
                            Display="Dynamic">
                        </asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="form-group">
                        <asp:Label ID="lblEmail" runat="server" Text="E-posta Adresiniz" AssociatedControlID="txtEmail"></asp:Label>
                        <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" placeholder="E-posta Adresiniz" TextMode="Email"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reqEmail" runat="server" 
                            ControlToValidate="txtEmail" 
                            ErrorMessage="E-posta adresi gereklidir." 
                            CssClass="validator-message" 
                            Display="Dynamic">
                        </asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="regexEmail" runat="server" 
                            ControlToValidate="txtEmail" 
                            ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" 
                            ErrorMessage="Geçerli bir e-posta adresi giriniz." 
                            CssClass="validator-message" 
                            Display="Dynamic">
                        </asp:RegularExpressionValidator>
                    </div>
                    
                    <div class="form-group">
                        <asp:Label ID="lblSubject" runat="server" Text="Konu" AssociatedControlID="txtSubject"></asp:Label>
                        <asp:TextBox ID="txtSubject" runat="server" CssClass="form-control" placeholder="Konu"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reqSubject" runat="server" 
                            ControlToValidate="txtSubject" 
                            ErrorMessage="Konu gereklidir." 
                            CssClass="validator-message" 
                            Display="Dynamic">
                        </asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="form-group">
                        <asp:Label ID="lblMessage" runat="server" Text="Mesajınız" AssociatedControlID="txtMessage"></asp:Label>
                        <asp:TextBox ID="txtMessage" runat="server" CssClass="form-control" placeholder="Mesajınız" TextMode="MultiLine" Rows="5"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reqMessage" runat="server" 
                            ControlToValidate="txtMessage" 
                            ErrorMessage="Mesaj gereklidir." 
                            CssClass="validator-message" 
                            Display="Dynamic">
                        </asp:RequiredFieldValidator>
                    </div>
                    
                    <div class="form-group">
                        <asp:Button ID="btnSubmit" runat="server" Text="Gönder" CssClass="submit-btn" OnClick="btnSubmit_Click" />
                    </div>
                    
                    <asp:Panel ID="pnlSuccess" runat="server" CssClass="alert alert-success" Visible="false">
                        <i class="fas fa-check-circle"></i> Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                    </asp:Panel>
                    
                    <asp:Panel ID="pnlError" runat="server" CssClass="alert alert-error" Visible="false">
                        <i class="fas fa-exclamation-circle"></i> <asp:Literal ID="litErrorMessage" runat="server"></asp:Literal>
                    </asp:Panel>
                </div>
            </div>
            
            <div class="contact-info-section">
                <h3>İletişim Bilgileri</h3>
                <div class="contact-info">
                    <div class="contact-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="contact-info-content">
                            <h4>Adres</h4>
                            <p>Senirkent Meslek Yüksekokulu, Isparta Üniversitesi, Senirkent/Isparta</p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <i class="fas fa-phone-alt"></i>
                        <div class="contact-info-content">
                            <h4>Telefon</h4>
                            <p>+90 246 XXX XX XX</p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <i class="fas fa-envelope"></i>
                        <div class="contact-info-content">
                            <h4>E-posta</h4>
                            <p>info@senirkentmyo.edu.tr</p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <i class="fas fa-clock"></i>
                        <div class="contact-info-content">
                            <h4>Çalışma Saatleri</h4>
                            <p>Pazartesi - Cuma: 08:30 - 17:30</p>
                        </div>
                    </div>
                </div>
                
                <div class="social-media">
                    <h3>Sosyal Medya</h3>
                    <div class="social-icons">
                        <a href="#" target="_blank" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>
                        <a href="#" target="_blank" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" target="_blank" class="social-icon"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="map-section">
            <h3>Konum</h3>
            <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDM4JzIzLjAiTiAzMMKwMTUnMTQuNCJF!5e0!3m2!1str!2str!4v1651567283693!5m2!1str!2str" 
                        width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/contact.js"></script>
</asp:Content>
