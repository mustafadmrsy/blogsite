using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class Kategoriler : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Tüm kategorileri yükle
            LoadCategories();

            // URL'den kategori parametresi var mı kontrol et
            string categoryParam = Request.QueryString["kategori"];
            if (!string.IsNullOrEmpty(categoryParam))
            {
                // Belirli bir kategori seçilmişse, o kategorinin içeriğini göster
                ShowCategoryContent(categoryParam);
            }
        }
    }

    private void LoadCategories()
    {
        try
        {
            // Veritabanından kategorileri çek
            DataTable dt = GetCategoriesFromDatabase();
            
            // Repeater'a veri bağla
            rptCategories.DataSource = dt;
            rptCategories.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Kategoriler yüklenirken hata: " + ex.Message);
        }
    }

    private DataTable GetCategoriesFromDatabase()
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("CategoryID", typeof(int));
        dt.Columns.Add("CategoryName", typeof(string));
        dt.Columns.Add("PostCount", typeof(int));

        // Örnek veriler
        dt.Rows.Add(1, "Teknoloji", 5);
        dt.Rows.Add(2, "Eğitim", 3);
        dt.Rows.Add(3, "Tasarım", 7);
        dt.Rows.Add(4, "Programlama", 9);
        dt.Rows.Add(5, "Veritabanı", 4);
        dt.Rows.Add(6, "Mobil", 6);
        dt.Rows.Add(7, "Web Geliştirme", 8);
        dt.Rows.Add(8, "Yapay Zeka", 2);

        return dt;
    }

    protected string GetCategoryIcon(string categoryName)
    {
        // Kategori adına göre uygun ikon class'ını döndür
        switch (categoryName.ToLower())
        {
            case "teknoloji":
                return "fas fa-microchip";
            case "eğitim":
                return "fas fa-graduation-cap";
            case "tasarım":
                return "fas fa-palette";
            case "programlama":
                return "fas fa-code";
            case "veritabanı":
                return "fas fa-database";
            case "mobil":
                return "fas fa-mobile-alt";
            case "web geliştirme":
                return "fas fa-laptop-code";
            case "yapay zeka":
                return "fas fa-brain";
            default:
                return "fas fa-folder";
        }
    }

    protected void rptCategories_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        if (e.CommandName == "ViewCategory")
        {
            string categoryName = e.CommandArgument.ToString();
            ShowCategoryContent(categoryName);
        }
    }

    private void ShowCategoryContent(string categoryName)
    {
        try
        {
            // Kategori başlığını ayarla
            selectedCategoryTitle.InnerText = categoryName + " Kategorisi";
            
            // Veritabanından seçilen kategoriye ait blog yazılarını çek
            DataTable dt = GetBlogPostsByCategory(categoryName);
            
            // Repeater'a veri bağla
            rptCategoryPosts.DataSource = dt;
            rptCategoryPosts.DataBind();
            
            // Kategori içerik bölümünü görünür yap
            categoryContentSection.Visible = true;
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Kategori içeriği yüklenirken hata: " + ex.Message);
        }
    }

    private DataTable GetBlogPostsByCategory(string categoryName)
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("ID", typeof(int));
        dt.Columns.Add("Title", typeof(string));
        dt.Columns.Add("Summary", typeof(string));
        dt.Columns.Add("Content", typeof(string));
        dt.Columns.Add("ImageUrl", typeof(string));
        dt.Columns.Add("Author", typeof(string));
        dt.Columns.Add("PublishedDate", typeof(DateTime));
        dt.Columns.Add("ViewCount", typeof(int));
        dt.Columns.Add("Category", typeof(string));

        // Örnek veriler - kategoriye göre filtrele
        if (categoryName.ToLower() == "teknoloji")
        {
            dt.Rows.Add(1, "ASP.NET ile Web Geliştirme", "Web geliştirme sürecinde ASP.NET'in temel avantajları", "Detaylı içerik...", "Images/blog1.jpg", "Ahmet Yılmaz", DateTime.Now.AddDays(-5), 125, "Teknoloji");
            dt.Rows.Add(4, "Bulut Teknolojileri", "Modern işletmeler için bulut çözümleri", "Detaylı içerik...", "Images/blog4.jpg", "Ali Can", DateTime.Now.AddDays(-7), 98, "Teknoloji");
        }
        else if (categoryName.ToLower() == "veritabanı")
        {
            dt.Rows.Add(2, "Veritabanı Tasarımı", "SQL Server ile etkili veritabanı tasarımı", "Detaylı içerik...", "Images/blog2.jpg", "Mehmet Kaya", DateTime.Now.AddDays(-3), 87, "Veritabanı");
            dt.Rows.Add(5, "NoSQL Çözümleri", "Modern uygulamalar için NoSQL veritabanları", "Detaylı içerik...", "Images/blog5.jpg", "Zeynep Yıldız", DateTime.Now.AddDays(-10), 74, "Veritabanı");
        }
        else if (categoryName.ToLower() == "tasarım")
        {
            dt.Rows.Add(3, "Modern Web Tasarımı", "HTML5 ve CSS3 ile modern web siteleri oluşturma", "Detaylı içerik...", "Images/blog3.jpg", "Ayşe Demir", DateTime.Now.AddDays(-1), 210, "Tasarım");
            dt.Rows.Add(6, "Responsive Tasarım İlkeleri", "Tüm cihazlarda çalışan web siteleri", "Detaylı içerik...", "Images/blog6.jpg", "Can Demir", DateTime.Now.AddDays(-8), 115, "Tasarım");
        }

        return dt;
    }

    protected void btnBackToCategories_Click(object sender, EventArgs e)
    {
        // Kategori içerik bölümünü gizle
        categoryContentSection.Visible = false;
    }

    protected void btnReadMore_Click(object sender, EventArgs e)
    {
        // Tıklanan blog yazısının ID'sini al
        Button btn = (Button)sender;
        int blogId = Convert.ToInt32(btn.CommandArgument);
        
        // Blog detay sayfasına yönlendir
        Response.Redirect("BlogDetay.aspx?id=" + blogId);
    }
}
