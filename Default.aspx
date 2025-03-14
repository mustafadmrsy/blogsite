<%@ Page Title="Ana Sayfa - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/index-specific.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="snk-content-layout">
        <!-- Sol Sütun (Blog Yazıları) -->
        <div class="snk-content-main">
            <div class="snk-content-header">
                <h2 class="snk-content-title">En Güncel Paylaşımlar</h2>
            </div>
            
            <!-- Son Blog Yazıları -->
            <div class="snk-recent-posts" id="snk_postsContainer">
                <asp:Repeater ID="rptBlogPosts" runat="server">
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
                                <div class="snk-blog-categories">
                                    <span class="snk-category-tag"><%# Eval("Category") %></span>
                                </div>
                                <asp:Button ID="btnReadMore" runat="server" Text="Devamını Oku" CssClass="snk-read-more" 
                                    CommandName="ReadMore" CommandArgument='<%# Eval("ID") %>' OnClick="btnReadMore_Click" />
                            </div>
                        </div>
                    </ItemTemplate>
                    <EmptyDataTemplate>
                        <div class="snk-loading">
                            <i class="fas fa-spinner fa-spin"></i> Yükleniyor...
                        </div>
                    </EmptyDataTemplate>
                </asp:Repeater>
            </div>
        </div>
        
        <!-- Sağ Sütun (Kutucuklar için) -->
        <div class="snk-content-sidebar" id="snk_contentSidebar">
            <!-- En Çok Okunan Yazılar Kutucuğu -->
            <div class="snk-sidebar-widget">
                <div class="snk-sidebar-widget-header">
                    <h3 class="snk-sidebar-widget-title">Blog Yazıları</h3>
                </div>
                <div class="snk-sidebar-widget-content">
                    <div class="snk-popular-posts" id="snk_popularPosts">
                        <asp:Repeater ID="rptPopularPosts" runat="server">
                            <ItemTemplate>
                                <div class="snk-popular-post-item">
                                    <img src='<%# Eval("ImageUrl") %>' alt='<%# Eval("Title") %>' class="snk-popular-post-img">
                                    <div class="snk-popular-post-info">
                                        <h4 class="snk-popular-post-title"><%# Eval("Title") %></h4>
                                        <p class="snk-popular-post-meta"><%# Eval("PublishedDate", "{0:dd.MM.yyyy}") %> · <%# Eval("ViewCount") %> görüntülenme</p>
                                    </div>
                                </div>
                            </ItemTemplate>
                            <EmptyDataTemplate>
                                <div class="snk-no-posts">
                                    Henüz blog yazısı bulunamadı.
                                </div>
                            </EmptyDataTemplate>
                        </asp:Repeater>
                    </div>
                    <a href="Kategoriler.aspx" class="snk-more-link">Tüm kategorileri gör <i class="fas fa-angle-right"></i></a>
                </div>
            </div>
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
                    <button class="snk-blog-action-btn snk-like-btn"><i class="far fa-heart"></i> Beğen</button>
                    <button class="snk-blog-action-btn snk-comment-btn"><i class="far fa-comment"></i> Yorum Yap</button>
                    <button class="snk-blog-action-btn snk-share-btn"><i class="far fa-share-square"></i> Paylaş</button>
                </div>
                <div class="snk-blog-comments" id="blogComments">
                    <!-- Yorumlar dinamik olarak yüklenecek -->
                </div>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/main.js"></script>
    <script src="Scripts/blog-detail.js"></script>
    <script src="Scripts/comment-system.js"></script>
</asp:Content>
