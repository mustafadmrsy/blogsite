<%@ Page Title="Arama Sonuçları - Senirkent Blog" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Arama.aspx.cs" Inherits="Arama" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Content/search.css">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="search-container">
        <div class="search-header">
            <h1 class="search-title">Arama Sonuçları</h1>
            <div class="search-bar">
                <asp:TextBox ID="txtSearchQuery" runat="server" CssClass="search-input" placeholder="Blog'da ara..."></asp:TextBox>
                <asp:Button ID="btnSearch" runat="server" CssClass="search-button" Text="Ara" OnClick="btnSearch_Click" />
            </div>
            <div class="search-meta">
                <asp:Literal ID="litSearchMeta" runat="server"></asp:Literal>
            </div>
        </div>

        <div class="search-tabs">
            <asp:LinkButton ID="lnkAllResults" runat="server" CssClass="search-tab active" OnClick="lnkAllResults_Click">
                <i class="fas fa-search"></i> Tüm Sonuçlar
            </asp:LinkButton>
            <asp:LinkButton ID="lnkPosts" runat="server" CssClass="search-tab" OnClick="lnkPosts_Click">
                <i class="fas fa-file-alt"></i> Bloglar
            </asp:LinkButton>
            <asp:LinkButton ID="lnkAuthors" runat="server" CssClass="search-tab" OnClick="lnkAuthors_Click">
                <i class="fas fa-user"></i> Yazarlar
            </asp:LinkButton>
            <asp:LinkButton ID="lnkCategories" runat="server" CssClass="search-tab" OnClick="lnkCategories_Click">
                <i class="fas fa-folder"></i> Kategoriler
            </asp:LinkButton>
        </div>

        <div class="search-filters">
            <div class="filter-group">
                <label for="ddlSortBy" class="filter-label">Sıralama:</label>
                <asp:DropDownList ID="ddlSortBy" runat="server" CssClass="filter-select" AutoPostBack="true" OnSelectedIndexChanged="ddlSortBy_SelectedIndexChanged">
                    <asp:ListItem Value="relevance" Selected="True">İlgiye Göre</asp:ListItem>
                    <asp:ListItem Value="date_desc">En Yeni</asp:ListItem>
                    <asp:ListItem Value="date_asc">En Eski</asp:ListItem>
                    <asp:ListItem Value="views_desc">En Çok Görüntülenen</asp:ListItem>
                    <asp:ListItem Value="likes_desc">En Çok Beğenilen</asp:ListItem>
                </asp:DropDownList>
            </div>
            <div class="filter-group">
                <label for="ddlTimeFrame" class="filter-label">Tarih:</label>
                <asp:DropDownList ID="ddlTimeFrame" runat="server" CssClass="filter-select" AutoPostBack="true" OnSelectedIndexChanged="ddlTimeFrame_SelectedIndexChanged">
                    <asp:ListItem Value="all" Selected="True">Tüm Zamanlar</asp:ListItem>
                    <asp:ListItem Value="day">Son 24 Saat</asp:ListItem>
                    <asp:ListItem Value="week">Son Hafta</asp:ListItem>
                    <asp:ListItem Value="month">Son Ay</asp:ListItem>
                    <asp:ListItem Value="year">Son Yıl</asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>

        <div class="search-results">
            <asp:Panel ID="pnlNoResults" runat="server" CssClass="no-results" Visible="false">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h2 class="no-results-title">Sonuç Bulunamadı</h2>
                <p class="no-results-text">
                    "<asp:Literal ID="litSearchQuery" runat="server"></asp:Literal>" için arama sonucu bulunamadı.
                </p>
                <div class="no-results-suggestions">
                    <h4>Öneriler:</h4>
                    <ul>
                        <li>Farklı anahtar kelimeler kullanmayı deneyin</li>
                        <li>Yazım hatalarını kontrol edin</li>
                        <li>Daha genel terimler kullanın</li>
                        <li>Filtreleri temizleyin</li>
                    </ul>
                </div>
            </asp:Panel>

            <asp:Repeater ID="rptSearchResults" runat="server" OnItemCommand="rptSearchResults_ItemCommand">
                <ItemTemplate>
                    <div class="search-result-item">
                        <div class="result-image">
                            <img src='<%# Eval("ImageUrl") %>' alt='<%# Eval("Title") %>'>
                        </div>
                        <div class="result-content">
                            <div class="result-type">
                                <span class='<%# GetResultTypeClass(Eval("Type").ToString()) %>'>
                                    <i class='<%# GetResultTypeIcon(Eval("Type").ToString()) %>'></i> <%# GetResultTypeName(Eval("Type").ToString()) %>
                                </span>
                            </div>
                            <h3 class="result-title"><%# Eval("Title") %></h3>
                            <div class="result-meta">
                                <span class="result-date"><i class="far fa-calendar-alt"></i> <%# Eval("Date", "{0:dd.MM.yyyy}") %></span>
                                <span class="result-author"><i class="far fa-user"></i> <%# Eval("Author") %></span>
                                <%# Eval("Type").ToString() == "post" ? "<span class='result-views'><i class='far fa-eye'></i> " + Eval("ViewCount") + " görüntülenme</span>" : "" %>
                            </div>
                            <p class="result-excerpt"><%# HighlightSearchTerms(Eval("Excerpt").ToString()) %></p>
                            <div class="result-footer">
                                <%# Eval("Type").ToString() == "post" ? "<div class='result-categories'><span class='category-tag'>" + Eval("Category") + "</span></div>" : "" %>
                                <asp:Button ID="btnViewResult" runat="server" Text="Görüntüle" CssClass="result-button" 
                                    CommandName="ViewResult" CommandArgument='<%# Eval("ID") + "," + Eval("Type") %>' />
                            </div>
                        </div>
                    </div>
                </ItemTemplate>
                <FooterTemplate>
                    <div class="search-pagination">
                        <asp:LinkButton ID="lnkPrevPage" runat="server" CssClass="pagination-btn prev-btn" OnClick="lnkPrevPage_Click" Enabled="<%# CurrentPage > 1 %>">
                            <i class="fas fa-chevron-left"></i> Önceki
                        </asp:LinkButton>
                        <div class="pagination-info">
                            Sayfa <asp:Literal ID="litCurrentPage" runat="server" Text="<%# CurrentPage %>"></asp:Literal> / 
                            <asp:Literal ID="litTotalPages" runat="server" Text="<%# TotalPages %>"></asp:Literal>
                        </div>
                        <asp:LinkButton ID="lnkNextPage" runat="server" CssClass="pagination-btn next-btn" OnClick="lnkNextPage_Click" Enabled="<%# CurrentPage < TotalPages %>">
                            Sonraki <i class="fas fa-chevron-right"></i>
                        </asp:LinkButton>
                    </div>
                </FooterTemplate>
            </asp:Repeater>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="Scripts/sidebar.js"></script>
    <script src="Scripts/search.js"></script>
</asp:Content>
