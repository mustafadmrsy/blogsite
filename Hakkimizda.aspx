<%@ Page Title="Hakkımızda - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Hakkimizda.aspx.cs" Inherits="Hakkimizda" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/aboutus.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="about-container">
        <div class="about-header">
            <h2 class="about-title">Hakkımızda</h2>
        </div>
        
        <div class="about-content">
            <div class="about-section">
                <h3>Biz Kimiz?</h3>
                <p>Senirkent Blog, Senirkent Meslek Yüksekokulu tarafından yönetilen bir blog platformudur. Amacımız, öğrencilerimize ve akademisyenlerimize özgün içerikler sunmak, güncel teknolojileri takip etmelerini sağlamak ve kendi deneyimlerini paylaşabilecekleri bir platform oluşturmaktır.</p>
                
                <div class="about-img-container">
                    <img src="Images/about-banner.jpg" alt="Senirkent Blog Ekibi" class="about-img">
                </div>
            </div>
            
            <div class="about-section">
                <h3>Misyonumuz</h3>
                <p>Öğrencilerimize ve akademisyenlerimize özgün ve kaliteli içerik sunmak, güncel teknolojileri ve gelişmeleri takip etmelerini sağlamak, bilgi paylaşımını desteklemek ve topluluk bilincini güçlendirmektir.</p>
            </div>
            
            <div class="about-section">
                <h3>Vizyonumuz</h3>
                <p>Teknoloji ve bilişim dünyasındaki gelişmeleri takip eden, öğrencilerimize ve akademisyenlerimize değer katan, bölgedeki teknolojik farkındalığı artıran öncü bir platform olmaktır.</p>
            </div>
            
            <div class="about-section">
                <h3>Ekibimiz</h3>
                <div class="team-container">
                    <asp:Repeater ID="rptTeamMembers" runat="server">
                        <ItemTemplate>
                            <div class="team-member">
                                <img src='<%# Eval("PhotoUrl") %>' alt='<%# Eval("Name") %>' class="team-member-img">
                                <h4 class="team-member-name"><%# Eval("Name") %></h4>
                                <p class="team-member-title"><%# Eval("Title") %></p>
                                <p class="team-member-desc"><%# Eval("Description") %></p>
                                <div class="social-links">
                                    <a href='<%# Eval("LinkedIn") %>' target="_blank"><i class="fab fa-linkedin"></i></a>
                                    <a href='<%# Eval("Twitter") %>' target="_blank"><i class="fab fa-twitter"></i></a>
                                    <a href='<%# "mailto:" + Eval("Email") %>'><i class="fas fa-envelope"></i></a>
                                </div>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                </div>
            </div>
            
            <div class="about-section">
                <h3>Neden Bize Katılmalısınız?</h3>
                <p>Senirkent Blog'da yazar olmak, düşüncelerinizi ve bilgilerinizi geniş bir kitleyle paylaşmanızı sağlar. Ayrıca alanınızdaki diğer profesyonellerle bağlantı kurma fırsatı elde edersiniz. Yazılarınız, diğer öğrencilere ve profesyonellere ilham verebilir, onlara yeni bakış açıları kazandırabilir.</p>
                <p>Katkıda bulunmak istiyorsanız, <a href="Iletisim.aspx">iletişim sayfamızdan</a> bize ulaşabilirsiniz.</p>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/aboutus.js"></script>
</asp:Content>
