using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class _Default : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Blog yazılarını yükle
            LoadBlogPosts();
            
            // Popüler blog yazılarını yükle
            LoadPopularPosts();
        }
    }

    private void LoadBlogPosts()
    {
        try
        {
            // Veritabanından blog yazılarını çek
            DataTable dt = GetBlogPostsFromDatabase();
            
            // Repeater'a veri bağla
            rptBlogPosts.DataSource = dt;
            rptBlogPosts.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Blog yazıları yüklenirken hata: " + ex.Message);
        }
    }

    private void LoadPopularPosts()
    {
        try
        {
            // Veritabanından popüler blog yazılarını çek
            DataTable dt = GetPopularPostsFromDatabase();
            
            // Repeater'a veri bağla
            rptPopularPosts.DataSource = dt;
            rptPopularPosts.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Popüler yazılar yüklenirken hata: " + ex.Message);
        }
    }

    private DataTable GetBlogPostsFromDatabase()
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

        // Örnek veriler
        dt.Rows.Add(1, "ASP.NET ile Web Geliştirme", "Web geliştirme sürecinde ASP.NET'in temel avantajları", "Detaylı içerik...", "Images/blog1.jpg", "Ahmet Yılmaz", DateTime.Now.AddDays(-5), 125, "Teknoloji");
        dt.Rows.Add(2, "Veritabanı Tasarımı", "SQL Server ile etkili veritabanı tasarımı", "Detaylı içerik...", "Images/blog2.jpg", "Mehmet Kaya", DateTime.Now.AddDays(-3), 87, "Veritabanı");
        dt.Rows.Add(3, "Modern Web Tasarımı", "HTML5 ve CSS3 ile modern web siteleri oluşturma", "Detaylı içerik...", "Images/blog3.jpg", "Ayşe Demir", DateTime.Now.AddDays(-1), 210, "Tasarım");

        return dt;
    }

    private DataTable GetPopularPostsFromDatabase()
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("ID", typeof(int));
        dt.Columns.Add("Title", typeof(string));
        dt.Columns.Add("ImageUrl", typeof(string));
        dt.Columns.Add("PublishedDate", typeof(DateTime));
        dt.Columns.Add("ViewCount", typeof(int));

        // Görüntülenme sayısına göre sıralanmış örnek veriler
        dt.Rows.Add(3, "Modern Web Tasarımı", "Images/blog3.jpg", DateTime.Now.AddDays(-1), 210);
        dt.Rows.Add(1, "ASP.NET ile Web Geliştirme", "Images/blog1.jpg", DateTime.Now.AddDays(-5), 125);
        dt.Rows.Add(2, "Veritabanı Tasarımı", "Images/blog2.jpg", DateTime.Now.AddDays(-3), 87);

        return dt;
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
