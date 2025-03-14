<%@ Page Title="Kategoriler - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Kategoriler.aspx.cs" Inherits="Kategoriler" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/category-custom.css">
    <link rel="stylesheet" href="Content/popup.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="snk-categories-header">
        <h2 class="snk-categories-title">Tüm Kategoriler</h2>
        <p class="snk-categories-description">İlgilendiğiniz konulara göre içeriklerimizi keşfedin.</p>
    </div>

    <div class="snk-categories-container">
        <asp:Repeater ID="rptCategories" runat="server" OnItemCommand="rptCategories_ItemCommand">
            <ItemTemplate>
                <div class="snk-category-item">
                    <div class="snk-category-icon">
                        <i class='<%# GetCategoryIcon(Eval("CategoryName").ToString()) %>'></i>
                    </div>
                    <h3 class="snk-category-name"><%# Eval("CategoryName") %></h3>
                    <p class="snk-category-count"><%# Eval("PostCount") %> yazı</p>
                    <asp:LinkButton ID="btnViewCategory" runat="server" CssClass="snk-category-btn" 
                        CommandName="ViewCategory" CommandArgument='<%# Eval("CategoryName") %>'>
                        Kategoriyi Gör
                    </asp:LinkButton>
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>

    <!-- Kategori İçeriği Bölümü -->
    <div id="categoryContentSection" runat="server" visible="false" class="category-content-section">
        <div class="category-content-header">
            <asp:LinkButton ID="btnBackToCategories" runat="server" CssClass="back-to-categories" OnClick="btnBackToCategories_Click">
                <i class="fas fa-arrow-left"></i> Tüm Kategorilere Dön
            </asp:LinkButton>
            <h2 id="selectedCategoryTitle" runat="server" class="selected-category-title"></h2>
        </div>

        <div class="category-posts-container">
            <asp:Repeater ID="rptCategoryPosts" runat="server">
                <ItemTemplate>
                    <div class="snk-blog-card">
                        <div class="snk-blog-img">
                            <img src='<%# Eval("ImageUrl") %>' alt='<%# Eval("Title") %>'>
                        </div>
                        <div class="snk-blog-content">
                            <h3 class="snk-blog-title"><%# Eval("Title") %></h3>
                            <div class="snk-blog-meta">
                                <span class="snk-blog-date"><i class="far fa-calendar-alt"></i> <%# Eval("PublishedDate", "{0:dd.MM.yyyy}") %></span>
                                <span class="snk-blog-author"><i class="far fa-user"></i> <%# Eval("Author") %></span>
                                <span class="snk-blog-views"><i class="far fa-eye"></i> <%# Eval("ViewCount") %> görüntülenme</span>
                            </div>
                            <p class="snk-blog-excerpt"><%# Eval("Summary") %></p>
                            <asp:Button ID="btnReadMore" runat="server" Text="Devamını Oku" CssClass="snk-read-more" 
                                CommandName="ReadMore" CommandArgument='<%# Eval("ID") %>' OnClick="btnReadMore_Click" />
                        </div>
                    </div>
                </ItemTemplate>
                <EmptyDataTemplate>
                    <div class="no-posts-message">
                        <i class="fas fa-inbox"></i>
                        <p>Bu kategoride henüz blog yazısı bulunmuyor.</p>
                    </div>
                </EmptyDataTemplate>
            </asp:Repeater>
        </div>
    </div>

    <!-- Blog Detay Popup'ı -->
    <div id="blogDetailModal" class="snk-modal">
        <div class="snk-modal-content">
            <div class="snk-modal-header">
                <h2 id="blogDetailTitle"></h2>
                <span class="snk-modal-close">&times;</span>
            </div>
            <div class="snk-modal-body" id="blogDetailContent">
                <!-- Blog içeriği dinamik olarak yüklenecek -->
            </div>
            <div class="snk-modal-footer">
                <div class="snk-blog-actions">
                    <button class="snk-blog-action-btn snk-like-btn" type="button"><i class="far fa-heart"></i> Beğen</button>
                    <button class="snk-blog-action-btn snk-comment-btn" type="button"><i class="far fa-comment"></i> Yorum Yap</button>
                    <button class="snk-blog-action-btn snk-share-btn" type="button"><i class="far fa-share-square"></i> Paylaş</button>
                </div>
                <div class="snk-blog-comments" id="blogComments">
                    <!-- Yorumlar dinamik olarak yüklenecek -->
                </div>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/categories.js"></script>
    <script src="Scripts/popup-handler.js"></script>
    <script src="Scripts/comment-system.js"></script>
</asp:Content>
