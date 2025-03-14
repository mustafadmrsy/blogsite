using System;
using System.Collections.Generic;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text.RegularExpressions;

public partial class Arama : Page
{
    // Arama sonuçları sayfalama değişkenleri
    protected int CurrentPage = 1;
    protected int TotalPages = 1;
    private const int ResultsPerPage = 10;
    
    // Filtre değişkenleri
    private string _activeTab = "all";
    private string _sortBy = "relevance";
    private string _timeFrame = "all";
    
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // URL'den arama parametresini al
            string searchQuery = Request.QueryString["q"];
            
            if (!string.IsNullOrEmpty(searchQuery))
            {
                txtSearchQuery.Text = searchQuery;
                
                // URL'den sayfa parametresini al (varsa)
                if (!string.IsNullOrEmpty(Request.QueryString["page"]))
                {
                    int.TryParse(Request.QueryString["page"], out int page);
                    if (page > 0) CurrentPage = page;
                }
                
                // URL'den filtre parametrelerini al (varsa)
                if (!string.IsNullOrEmpty(Request.QueryString["tab"]))
                {
                    _activeTab = Request.QueryString["tab"];
                    SetActiveTab(_activeTab);
                }
                
                if (!string.IsNullOrEmpty(Request.QueryString["sort"]))
                {
                    _sortBy = Request.QueryString["sort"];
                    ddlSortBy.SelectedValue = _sortBy;
                }
                
                if (!string.IsNullOrEmpty(Request.QueryString["time"]))
                {
                    _timeFrame = Request.QueryString["time"];
                    ddlTimeFrame.SelectedValue = _timeFrame;
                }
                
                // Arama yap
                PerformSearch(searchQuery);
            }
            else
            {
                // Arama parametresi yoksa arama sonuçları panelini gizle
                pnlNoResults.Visible = true;
                litSearchMeta.Text = "Aramak için yukarıdaki alana arama sorgunuzu yazın.";
            }
        }
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        string searchQuery = txtSearchQuery.Text.Trim();
        
        if (!string.IsNullOrEmpty(searchQuery))
        {
            // Arama için URL oluştur (sayfa yenilenecek)
            string url = $"Arama.aspx?q={Server.UrlEncode(searchQuery)}";
            Response.Redirect(url);
        }
    }

    protected void lnkAllResults_Click(object sender, EventArgs e)
    {
        RedirectWithTab("all");
    }

    protected void lnkPosts_Click(object sender, EventArgs e)
    {
        RedirectWithTab("posts");
    }

    protected void lnkAuthors_Click(object sender, EventArgs e)
    {
        RedirectWithTab("authors");
    }

    protected void lnkCategories_Click(object sender, EventArgs e)
    {
        RedirectWithTab("categories");
    }

    protected void ddlSortBy_SelectedIndexChanged(object sender, EventArgs e)
    {
        _sortBy = ddlSortBy.SelectedValue;
        RedirectWithFilters();
    }

    protected void ddlTimeFrame_SelectedIndexChanged(object sender, EventArgs e)
    {
        _timeFrame = ddlTimeFrame.SelectedValue;
        RedirectWithFilters();
    }

    protected void lnkPrevPage_Click(object sender, EventArgs e)
    {
        if (CurrentPage > 1)
        {
            CurrentPage--;
            RedirectWithFilters();
        }
    }

    protected void lnkNextPage_Click(object sender, EventArgs e)
    {
        if (CurrentPage < TotalPages)
        {
            CurrentPage++;
            RedirectWithFilters();
        }
    }

    protected void rptSearchResults_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        if (e.CommandName == "ViewResult")
        {
            // CommandArgument formatı: "ID,Type"
            string[] args = e.CommandArgument.ToString().Split(',');
            if (args.Length == 2)
            {
                string id = args[0];
                string type = args[1];
                
                // Sonuç tipine göre yönlendirme yap
                switch (type)
                {
                    case "post":
                        Response.Redirect($"BlogDetay.aspx?id={id}");
                        break;
                    case "author":
                        Response.Redirect($"Yazar.aspx?id={id}");
                        break;
                    case "category":
                        Response.Redirect($"Kategoriler.aspx?id={id}");
                        break;
                    default:
                        Response.Redirect($"BlogDetay.aspx?id={id}");
                        break;
                }
            }
        }
    }

    private void PerformSearch(string searchQuery)
    {
        // Gerçek uygulamada bu arama, veritabanı üzerinden yapılacak
        // Şimdilik simüle edilmiş veriler kullanacağız
        
        // Arama sonuçlarını filtreleme ve sıralama
        List<SearchResult> results = GetSearchResults(searchQuery);
        
        // Filtreleme
        results = FilterResults(results);
        
        // Sıralama
        results = SortResults(results);
        
        // Toplam sayfa sayısını hesapla
        TotalPages = (int)Math.Ceiling((double)results.Count / ResultsPerPage);
        if (TotalPages < 1) TotalPages = 1;
        
        // Geçerli sayfa kontrolü
        if (CurrentPage > TotalPages) CurrentPage = TotalPages;
        
        // Sayfalama
        int startIndex = (CurrentPage - 1) * ResultsPerPage;
        int endIndex = Math.Min(startIndex + ResultsPerPage, results.Count);
        
        List<SearchResult> pagedResults = new List<SearchResult>();
        if (results.Count > 0 && startIndex < results.Count)
        {
            for (int i = startIndex; i < endIndex; i++)
            {
                pagedResults.Add(results[i]);
            }
        }
        
        // Sonuç sayısını görüntüle
        litSearchQuery.Text = searchQuery;
        
        // Sonuçları göster
        if (results.Count > 0)
        {
            pnlNoResults.Visible = false;
            rptSearchResults.DataSource = pagedResults;
            rptSearchResults.DataBind();
            
            // Meta bilgisi güncelle
            string resultType = _activeTab == "all" ? "sonuç" : GetResultTypeName(_activeTab);
            litSearchMeta.Text = $"<strong>{results.Count}</strong> {resultType} bulundu - <strong>\"{searchQuery}\"</strong> için";
        }
        else
        {
            pnlNoResults.Visible = true;
            litSearchQuery.Text = searchQuery;
            litSearchMeta.Text = $"<strong>0</strong> sonuç bulundu - <strong>\"{searchQuery}\"</strong> için";
        }
    }

    private List<SearchResult> GetSearchResults(string searchQuery)
    {
        // Gerçek uygulamada veritabanından sonuçlar alınacak
        // Şimdilik test verileri ile dolduruyoruz
        
        List<SearchResult> results = new List<SearchResult>();
        
        // Test verileri - Bloglar
        results.Add(new SearchResult
        {
            ID = 1,
            Type = "post",
            Title = "Senirkent'te Bahar Festivali",
            Excerpt = "Her yıl düzenlenen Senirkent Bahar Festivali bu yıl da renkli görüntülere sahne oldu. Festival kapsamında...",
            Author = "Ahmet Yılmaz",
            Date = DateTime.Now.AddDays(-5),
            ImageUrl = "Images/sample-blog-1.jpg",
            Category = "Etkinlikler",
            ViewCount = 1250
        });
        
        results.Add(new SearchResult
        {
            ID = 2,
            Type = "post",
            Title = "Senirkent Gölleri: Doğal Güzellikler",
            Excerpt = "Senirkent bölgesindeki göller, doğal güzellikleri ile ziyaretçilerin ilgisini çekiyor. Bu yazımızda Senirkent'in...",
            Author = "Ayşe Demir",
            Date = DateTime.Now.AddDays(-10),
            ImageUrl = "Images/sample-blog-2.jpg",
            Category = "Doğa",
            ViewCount = 980
        });
        
        results.Add(new SearchResult
        {
            ID = 3,
            Type = "post",
            Title = "Senirkent'in Tarihi Mekanları",
            Excerpt = "Senirkent'in zengin tarihini yansıtan tarihi mekanları keşfediyoruz. Bu yazımızda Senirkent'teki tarihi camileri, konakları...",
            Author = "Mehmet Kaya",
            Date = DateTime.Now.AddDays(-15),
            ImageUrl = "Images/sample-blog-3.jpg",
            Category = "Tarih",
            ViewCount = 750
        });
        
        // Test verileri - Yazarlar
        results.Add(new SearchResult
        {
            ID = 101,
            Type = "author",
            Title = "Ahmet Yılmaz",
            Excerpt = "Senirkent Blog yazarı Ahmet Yılmaz, 5 yıldır blog yazarlığı yapıyor. Genellikle Senirkent'teki etkinlikler ve kültürel...",
            Author = "",
            Date = DateTime.Now.AddYears(-3),
            ImageUrl = "Images/authors/ahmet-yilmaz.jpg",
            Category = "",
            ViewCount = 0
        });
        
        // Test verileri - Kategoriler
        results.Add(new SearchResult
        {
            ID = 201,
            Type = "category",
            Title = "Etkinlikler",
            Excerpt = "Senirkent ve çevresinde gerçekleştirilen tüm etkinlikler, festivaller, konserler ve kültürel organizasyonlar hakkında...",
            Author = "",
            Date = DateTime.MinValue,
            ImageUrl = "Images/categories/events.jpg",
            Category = "",
            ViewCount = 0
        });
        
        // Arama sorgusu ile filtreleme
        List<SearchResult> filteredResults = new List<SearchResult>();
        string[] searchTerms = searchQuery.ToLower().Split(' ');
        
        foreach (var result in results)
        {
            bool matchesAllTerms = true;
            
            foreach (var term in searchTerms)
            {
                if (!result.Title.ToLower().Contains(term) && 
                    !result.Excerpt.ToLower().Contains(term) && 
                    !result.Category.ToLower().Contains(term) && 
                    !result.Author.ToLower().Contains(term))
                {
                    matchesAllTerms = false;
                    break;
                }
            }
            
            if (matchesAllTerms)
            {
                filteredResults.Add(result);
            }
        }
        
        return filteredResults;
    }

    private List<SearchResult> FilterResults(List<SearchResult> results)
    {
        List<SearchResult> filteredResults = new List<SearchResult>();
        
        // Tab filtresi
        foreach (var result in results)
        {
            if (_activeTab == "all" || 
                (_activeTab == "posts" && result.Type == "post") ||
                (_activeTab == "authors" && result.Type == "author") ||
                (_activeTab == "categories" && result.Type == "category"))
            {
                filteredResults.Add(result);
            }
        }
        
        // Zaman filtresi
        if (_timeFrame != "all")
        {
            DateTime cutoffDate = DateTime.Now;
            
            switch (_timeFrame)
            {
                case "day":
                    cutoffDate = DateTime.Now.AddDays(-1);
                    break;
                case "week":
                    cutoffDate = DateTime.Now.AddDays(-7);
                    break;
                case "month":
                    cutoffDate = DateTime.Now.AddMonths(-1);
                    break;
                case "year":
                    cutoffDate = DateTime.Now.AddYears(-1);
                    break;
            }
            
            filteredResults = filteredResults.FindAll(r => r.Date >= cutoffDate);
        }
        
        return filteredResults;
    }

    private List<SearchResult> SortResults(List<SearchResult> results)
    {
        switch (_sortBy)
        {
            case "date_desc":
                results.Sort((a, b) => b.Date.CompareTo(a.Date));
                break;
            case "date_asc":
                results.Sort((a, b) => a.Date.CompareTo(b.Date));
                break;
            case "views_desc":
                results.Sort((a, b) => b.ViewCount.CompareTo(a.ViewCount));
                break;
            case "likes_desc":
                // Beğeni sayısına göre sıralama (şimdilik görüntülenme ile aynı)
                results.Sort((a, b) => b.ViewCount.CompareTo(a.ViewCount));
                break;
            case "relevance":
            default:
                // Varsayılan olarak ilgiye göre sıralama (şimdilik değişiklik yok)
                break;
        }
        
        return results;
    }

    protected string GetResultTypeClass(string type)
    {
        switch (type)
        {
            case "post":
                return "result-type-post";
            case "author":
                return "result-type-author";
            case "category":
                return "result-type-category";
            default:
                return "result-type-post";
        }
    }

    protected string GetResultTypeIcon(string type)
    {
        switch (type)
        {
            case "post":
                return "fas fa-file-alt";
            case "author":
                return "fas fa-user";
            case "category":
                return "fas fa-folder";
            default:
                return "fas fa-file-alt";
        }
    }

    protected string GetResultTypeName(string type)
    {
        switch (type)
        {
            case "post":
            case "posts":
                return "Blog Yazısı";
            case "author":
            case "authors":
                return "Yazar";
            case "category":
            case "categories":
                return "Kategori";
            case "all":
                return "Sonuç";
            default:
                return "Sonuç";
        }
    }

    protected string HighlightSearchTerms(string text)
    {
        if (string.IsNullOrEmpty(txtSearchQuery.Text)) return text;
        
        string result = text;
        string[] searchTerms = txtSearchQuery.Text.ToLower().Split(' ');
        
        foreach (var term in searchTerms)
        {
            if (term.Length < 3) continue; // Çok kısa terimleri atla
            
            string pattern = "\\b(" + Regex.Escape(term) + ")\\b";
            result = Regex.Replace(result, pattern, "<span class='highlight'>$1</span>", RegexOptions.IgnoreCase);
        }
        
        return result;
    }

    private void SetActiveTab(string tab)
    {
        // Tüm sekmelerin active sınıfını kaldır
        lnkAllResults.CssClass = "search-tab";
        lnkPosts.CssClass = "search-tab";
        lnkAuthors.CssClass = "search-tab";
        lnkCategories.CssClass = "search-tab";
        
        // Aktif sekmenin active sınıfını ekle
        switch (tab)
        {
            case "posts":
                lnkPosts.CssClass += " active";
                break;
            case "authors":
                lnkAuthors.CssClass += " active";
                break;
            case "categories":
                lnkCategories.CssClass += " active";
                break;
            case "all":
            default:
                lnkAllResults.CssClass += " active";
                break;
        }
    }

    private void RedirectWithTab(string tab)
    {
        string searchQuery = txtSearchQuery.Text.Trim();
        
        if (string.IsNullOrEmpty(searchQuery))
        {
            searchQuery = Request.QueryString["q"] ?? "";
        }
        
        if (!string.IsNullOrEmpty(searchQuery))
        {
            string url = $"Arama.aspx?q={Server.UrlEncode(searchQuery)}&tab={tab}&sort={_sortBy}&time={_timeFrame}&page=1";
            Response.Redirect(url);
        }
    }

    private void RedirectWithFilters()
    {
        string searchQuery = txtSearchQuery.Text.Trim();
        
        if (string.IsNullOrEmpty(searchQuery))
        {
            searchQuery = Request.QueryString["q"] ?? "";
        }
        
        if (!string.IsNullOrEmpty(searchQuery))
        {
            string url = $"Arama.aspx?q={Server.UrlEncode(searchQuery)}&tab={_activeTab}&sort={_sortBy}&time={_timeFrame}&page={CurrentPage}";
            Response.Redirect(url);
        }
    }
}

public class SearchResult
{
    public int ID { get; set; }
    public string Type { get; set; } // post, author, category
    public string Title { get; set; }
    public string Excerpt { get; set; }
    public string Author { get; set; }
    public DateTime Date { get; set; }
    public string ImageUrl { get; set; }
    public string Category { get; set; }
    public int ViewCount { get; set; }
}
