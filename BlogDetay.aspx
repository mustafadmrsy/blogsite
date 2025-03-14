<%@ Page Title="Blog Detay - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="BlogDetay.aspx.cs" Inherits="BlogDetay" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/blog-detail.css">
    <link rel="stylesheet" href="Content/comment-system.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="blog-detail-container">
        <div class="blog-detail-header">
            <asp:LinkButton ID="btnBackToBlog" runat="server" CssClass="back-to-blog" OnClick="btnBackToBlog_Click">
                <i class="fas fa-arrow-left"></i> Geri Dön
            </asp:LinkButton>
            <h1 id="blogTitle" runat="server" class="blog-title"></h1>
            <div class="blog-meta">
                <span class="blog-author" id="blogAuthor" runat="server"><i class="far fa-user"></i></span>
                <span class="blog-date" id="blogDate" runat="server"><i class="far fa-calendar-alt"></i></span>
                <span class="blog-views" id="blogViews" runat="server"><i class="far fa-eye"></i></span>
                <span class="blog-category" id="blogCategory" runat="server"><i class="fas fa-folder"></i></span>
            </div>
        </div>
        
        <div class="blog-featured-image">
            <img id="blogImage" runat="server" src="" alt="" class="featured-img">
        </div>
        
        <div class="blog-content" id="blogContent" runat="server">
            <!-- Blog içeriği code-behind'dan yüklenir -->
        </div>
        
        <div class="blog-tags" id="blogTagsContainer" runat="server">
            <h3>Etiketler:</h3>
            <div class="tags-container">
                <asp:Repeater ID="rptTags" runat="server">
                    <ItemTemplate>
                        <a href='Kategoriler.aspx?etiket=<%# Eval("TagName") %>' class="tag-item"><%# Eval("TagName") %></a>
                    </ItemTemplate>
                </asp:Repeater>
            </div>
        </div>
        
        <div class="blog-action-buttons">
            <asp:LinkButton ID="btnLike" runat="server" CssClass="blog-action-btn like-btn" OnClick="btnLike_Click">
                <i class="far fa-heart"></i> <span id="likeCount" runat="server">0</span> Beğeni
            </asp:LinkButton>
            <button type="button" class="blog-action-btn comment-btn" id="openCommentBtn">
                <i class="far fa-comment"></i> <span id="commentCount" runat="server">0</span> Yorum
            </button>
            <button type="button" class="blog-action-btn share-btn" id="shareBtn">
                <i class="far fa-share-square"></i> Paylaş
            </button>
        </div>
        
        <!-- Yorum Bölümü -->
        <div class="blog-comments-section">
            <h3 class="comments-title">Yorumlar</h3>
            
            <!-- Yorum Formu -->
            <div class="comment-form">
                <h4>Yorum Yap</h4>
                <asp:Panel ID="pnlCommentForm" runat="server">
                    <div class="form-group">
                        <asp:TextBox ID="txtCommentText" runat="server" CssClass="comment-input" placeholder="Yorumunuzu yazın..." TextMode="MultiLine" Rows="4"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="reqComment" runat="server" ControlToValidate="txtCommentText" 
                            ErrorMessage="Yorum alanı boş bırakılamaz." CssClass="validator-message" Display="Dynamic" ValidationGroup="CommentGroup">
                        </asp:RequiredFieldValidator>
                    </div>
                    <div class="form-actions">
                        <asp:Button ID="btnSubmitComment" runat="server" Text="Yorum Gönder" CssClass="submit-comment-btn" 
                            OnClick="btnSubmitComment_Click" ValidationGroup="CommentGroup" />
                    </div>
                </asp:Panel>
                
                <asp:Panel ID="pnlLoginToComment" runat="server" Visible="false">
                    <div class="login-to-comment">
                        <p>Yorum yapabilmek için <asp:LinkButton ID="btnLoginToComment" runat="server" OnClick="btnLoginToComment_Click">giriş yapmalısınız</asp:LinkButton>.</p>
                    </div>
                </asp:Panel>
            </div>
            
            <!-- Yorumlar Listesi -->
            <div class="comments-list">
                <asp:Repeater ID="rptComments" runat="server" OnItemCommand="rptComments_ItemCommand">
                    <ItemTemplate>
                        <div class="comment-item">
                            <div class="comment-avatar">
                                <img src='<%# GetUserAvatarUrl(Eval("UserID").ToString()) %>' alt="Kullanıcı Avatarı">
                            </div>
                            <div class="comment-content">
                                <div class="comment-header">
                                    <h4 class="comment-author"><%# Eval("UserName") %></h4>
                                    <span class="comment-date"><%# Eval("CommentDate", "{0:dd.MM.yyyy HH:mm}") %></span>
                                </div>
                                <p class="comment-text"><%# Eval("CommentText") %></p>
                                <div class="comment-actions">
                                    <asp:LinkButton ID="btnLikeComment" runat="server" CssClass="comment-action like-comment" 
                                        CommandName="LikeComment" CommandArgument='<%# Eval("CommentID") %>'>
                                        <i class="far fa-heart"></i> <span><%# Eval("LikeCount") %></span>
                                    </asp:LinkButton>
                                    <asp:LinkButton ID="btnReplyComment" runat="server" CssClass="comment-action reply-comment" 
                                        CommandName="ReplyComment" CommandArgument='<%# Eval("CommentID") %>'>
                                        <i class="far fa-comment"></i> Yanıtla
                                    </asp:LinkButton>
                                    <asp:LinkButton ID="btnDeleteComment" runat="server" CssClass="comment-action delete-comment" 
                                        CommandName="DeleteComment" CommandArgument='<%# Eval("CommentID") %>'
                                        Visible='<%# CanDeleteComment(Eval("UserID").ToString()) %>'>
                                        <i class="far fa-trash-alt"></i> Sil
                                    </asp:LinkButton>
                                </div>
                            </div>
                        </div>
                    </ItemTemplate>
                    <EmptyDataTemplate>
                        <div class="no-comments">
                            <i class="far fa-comment-dots"></i>
                            <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                        </div>
                    </EmptyDataTemplate>
                </asp:Repeater>
            </div>
        </div>
        
        <!-- İlgili Yazılar -->
        <div class="related-posts">
            <h3 class="related-title">İlgili Yazılar</h3>
            <div class="related-posts-container">
                <asp:Repeater ID="rptRelatedPosts" runat="server">
                    <ItemTemplate>
                        <div class="related-post-item">
                            <div class="related-post-img">
                                <img src='<%# Eval("ImageUrl") %>' alt='<%# Eval("Title") %>'>
                            </div>
                            <div class="related-post-info">
                                <h4 class="related-post-title">
                                    <a href='BlogDetay.aspx?id=<%# Eval("ID") %>'><%# Eval("Title") %></a>
                                </h4>
                                <div class="related-post-meta">
                                    <span class="related-post-date"><i class="far fa-calendar-alt"></i> <%# Eval("PublishedDate", "{0:dd.MM.yyyy}") %></span>
                                    <span class="related-post-views"><i class="far fa-eye"></i> <%# Eval("ViewCount") %> görüntülenme</span>
                                </div>
                            </div>
                        </div>
                    </ItemTemplate>
                </asp:Repeater>
            </div>
        </div>
    </div>
    
    <!-- Paylaşım Modali -->
    <div id="shareModal" class="share-modal">
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Bu Blog Yazısını Paylaş</h3>
                <button type="button" class="share-modal-close">&times;</button>
            </div>
            <div class="share-modal-body">
                <div class="share-options">
                    <a href="#" class="share-option" id="shareFacebook">
                        <i class="fab fa-facebook-f"></i> Facebook
                    </a>
                    <a href="#" class="share-option" id="shareTwitter">
                        <i class="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="#" class="share-option" id="shareLinkedin">
                        <i class="fab fa-linkedin-in"></i> LinkedIn
                    </a>
                    <a href="#" class="share-option" id="shareWhatsapp">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
                <div class="share-link-container">
                    <h4>Bağlantıyı Kopyala</h4>
                    <div class="share-link-input">
                        <asp:TextBox ID="txtShareLink" runat="server" CssClass="share-link" ReadOnly="true"></asp:TextBox>
                        <button type="button" id="copyLinkBtn" class="copy-link-btn">Kopyala</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/blog-detail.js"></script>
    <script src="Scripts/comment-system.js"></script>
</asp:Content>
