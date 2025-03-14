using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class BlogDetay : Page
{
    // Blog yazısının ID'si
    private int blogId = 0;
    
    protected void Page_Load(object sender, EventArgs e)
    {
        // URL'den blog ID parametresini al
        if (Request.QueryString["id"] != null && int.TryParse(Request.QueryString["id"], out blogId))
        {
            if (!IsPostBack)
            {
                // Blog detaylarını yükle
                LoadBlogDetails();
                
                // Blog görüntülenme sayısını artır
                IncrementViewCount();
                
                // Blog yorumlarını yükle
                LoadComments();
                
                // İlgili blog yazılarını yükle
                LoadRelatedPosts();
                
                // Paylaşım linkini ayarla
                txtShareLink.Text = Request.Url.AbsoluteUri;
                
                // Kullanıcı giriş yapmış mı kontrol et
                CheckUserLogin();
            }
        }
        else
        {
            // Geçersiz blog ID, ana sayfaya yönlendir
            Response.Redirect("~/Default.aspx");
        }
    }
    
    private void LoadBlogDetails()
    {
        try
        {
            // Veritabanından blog detaylarını çek
            DataTable dt = GetBlogDetailsFromDatabase(blogId);
            
            if (dt.Rows.Count > 0)
            {
                // Blog içeriğini sayfaya yerleştir
                DataRow row = dt.Rows[0];
                blogTitle.InnerText = row["Title"].ToString();
                blogAuthor.InnerHtml = "<i class=\"far fa-user\"></i> " + row["Author"].ToString();
                blogDate.InnerHtml = "<i class=\"far fa-calendar-alt\"></i> " + Convert.ToDateTime(row["PublishedDate"]).ToString("dd.MM.yyyy");
                blogViews.InnerHtml = "<i class=\"far fa-eye\"></i> " + row["ViewCount"].ToString() + " görüntülenme";
                blogCategory.InnerHtml = "<i class=\"fas fa-folder\"></i> " + row["Category"].ToString();
                blogImage.Src = row["ImageUrl"].ToString();
                blogImage.Alt = row["Title"].ToString();
                blogContent.InnerHtml = row["Content"].ToString();
                likeCount.InnerText = row["LikeCount"].ToString();
                commentCount.InnerText = row["CommentCount"].ToString();
                
                // Blog etiketlerini yükle
                LoadBlogTags(blogId);
                
                // Sayfa başlığını güncelle
                Page.Title = row["Title"].ToString() + " - Senirkent Blog";
            }
            else
            {
                // Blog yazısı bulunamadı, ana sayfaya yönlendir
                Response.Redirect("~/Default.aspx");
            }
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Blog detayları yüklenirken hata: " + ex.Message);
            
            // Hata sayfasına yönlendirilebilir
            // Response.Redirect("~/Error.aspx");
        }
    }
    
    private DataTable GetBlogDetailsFromDatabase(int blogId)
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("ID", typeof(int));
        dt.Columns.Add("Title", typeof(string));
        dt.Columns.Add("Content", typeof(string));
        dt.Columns.Add("ImageUrl", typeof(string));
        dt.Columns.Add("Author", typeof(string));
        dt.Columns.Add("PublishedDate", typeof(DateTime));
        dt.Columns.Add("ViewCount", typeof(int));
        dt.Columns.Add("LikeCount", typeof(int));
        dt.Columns.Add("CommentCount", typeof(int));
        dt.Columns.Add("Category", typeof(string));

        // Örnek veri
        if (blogId == 1)
        {
            dt.Rows.Add(1, "ASP.NET ile Web Geliştirme", 
                "<p>ASP.NET, Microsoft tarafından geliştirilen güçlü bir web uygulama platformudur. Web geliştiricilerin dinamik web siteleri, web uygulamaları ve web servisleri oluşturmasına olanak tanır.</p>" +
                "<h2>ASP.NET'in Avantajları</h2>" +
                "<p>ASP.NET, modern web uygulamaları oluşturmak için birçok avantaj sunar:</p>" +
                "<ul>" +
                "<li><strong>Güçlü Araç Desteği:</strong> Visual Studio gibi gelişmiş IDE'lerle entegre çalışır.</li>" +
                "<li><strong>Güvenlik:</strong> Dahili güvenlik özellikleri ile uygulamalarınızı korur.</li>" +
                "<li><strong>Performans:</strong> Derlenen kod sayesinde yüksek performans sunar.</li>" +
                "<li><strong>Ölçeklenebilirlik:</strong> Küçük web sitelerinden büyük kurumsal uygulamalara kadar ölçeklenebilir.</li>" +
                "</ul>" +
                "<p>ASP.NET ile web geliştirmeye başlamak için, ilk olarak .NET Framework veya .NET Core'u sisteminize kurmanız gerekir. Ardından, Visual Studio veya Visual Studio Code gibi bir geliştirme ortamı kullanarak projelerinizi oluşturabilirsiniz.</p>" +
                "<h2>ASP.NET Web Forms vs MVC</h2>" +
                "<p>ASP.NET, Web Forms ve MVC gibi farklı programlama modelleri sunar. Web Forms, olay tabanlı ve durum yönetimli bir model sunarken, MVC daha modern ve test edilebilir bir mimari sağlar.</p>",
                "Images/blog1.jpg", "Ahmet Yılmaz", DateTime.Now.AddDays(-5), 125, 45, 8, "Teknoloji");
        }
        else if (blogId == 2)
        {
            dt.Rows.Add(2, "Veritabanı Tasarımı", 
                "<p>Veritabanı tasarımı, modern yazılım uygulamalarının temel taşıdır. İyi tasarlanmış bir veritabanı, uygulamanızın performansını ve bakımını büyük ölçüde etkiler.</p>" +
                "<h2>Veritabanı Tasarım İlkeleri</h2>" +
                "<p>Etkili bir veritabanı tasarımı için aşağıdaki ilkeleri göz önünde bulundurmalısınız:</p>" +
                "<ul>" +
                "<li><strong>Normalleştirme:</strong> Veri tekrarını en aza indirgeyen bir süreçtir.</li>" +
                "<li><strong>İndeksleme:</strong> Verilere hızlı erişim sağlar.</li>" +
                "<li><strong>İlişkiler:</strong> Tablolar arasındaki bağlantıları tanımlar.</li>" +
                "<li><strong>Veri Bütünlüğü:</strong> Verilerinizin tutarlılığını sağlar.</li>" +
                "</ul>" +
                "<p>SQL Server, Oracle, MySQL ve PostgreSQL gibi popüler veritabanı sistemleri, güçlü veritabanı çözümleri oluşturmanızı sağlar.</p>" +
                "<h2>NoSQL vs SQL</h2>" +
                "<p>Geleneksel ilişkisel veritabanlarının yanı sıra, MongoDB, Cassandra ve Redis gibi NoSQL veritabanları da belirli kullanım durumları için tercih edilebilir. NoSQL veritabanları, özellikle büyük veri ve yüksek ölçeklenebilirlik gerektiren senaryolarda avantaj sağlar.</p>",
                "Images/blog2.jpg", "Mehmet Kaya", DateTime.Now.AddDays(-3), 87, 32, 5, "Veritabanı");
        }
        else if (blogId == 3)
        {
            dt.Rows.Add(3, "Modern Web Tasarımı", 
                "<p>Modern web tasarımı, kullanıcı deneyimini ön planda tutan, görsel çekiciliği yüksek ve işlevsel web siteleri oluşturma sanatıdır.</p>" +
                "<h2>Modern Web Tasarım Trendleri</h2>" +
                "<p>Günümüzün web tasarım trendleri şunları içerir:</p>" +
                "<ul>" +
                "<li><strong>Responsive Tasarım:</strong> Tüm cihazlarda mükemmel görünen siteler.</li>" +
                "<li><strong>Minimalist Yaklaşım:</strong> Basit, temiz ve odaklanmış tasarımlar.</li>" +
                "<li><strong>Koyu Mod:</strong> Kullanıcı dostu ve göz yormayan alternatif tema.</li>" +
                "<li><strong>Mikro Etkileşimler:</strong> Kullanıcı etkileşimini artıran küçük animasyonlar.</li>" +
                "</ul>" +
                "<p>HTML5, CSS3 ve JavaScript, modern web tasarımının temel yapı taşlarıdır. Bu teknolojileri etkili bir şekilde kullanarak, çekici ve etkileşimli web siteleri oluşturabilirsiniz.</p>" +
                "<h2>UI/UX Tasarımı</h2>" +
                "<p>Kullanıcı Arayüzü (UI) ve Kullanıcı Deneyimi (UX) tasarımı, web sitelerinizin sadece güzel görünmesini değil, aynı zamanda kullanıcı dostu olmasını da sağlar. Figma, Adobe XD ve Sketch gibi araçlar, UI/UX tasarım sürecinizi kolaylaştırabilir.</p>",
                "Images/blog3.jpg", "Ayşe Demir", DateTime.Now.AddDays(-1), 210, 78, 12, "Tasarım");
        }
        else
        {
            // Varsayılan içerik
            dt.Rows.Add(blogId, "Örnek Blog Yazısı", 
                "<p>Bu bir örnek blog yazısıdır. İçerik yakında eklenecektir.</p>",
                "Images/default-blog.jpg", "Blog Yazarı", DateTime.Now, 0, 0, 0, "Genel");
        }

        return dt;
    }
    
    private void LoadBlogTags(int blogId)
    {
        try
        {
            // Veritabanından blog etiketlerini çek
            DataTable dt = GetBlogTagsFromDatabase(blogId);
            
            // Repeater'a veri bağla
            rptTags.DataSource = dt;
            rptTags.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Blog etiketleri yüklenirken hata: " + ex.Message);
        }
    }
    
    private DataTable GetBlogTagsFromDatabase(int blogId)
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("TagID", typeof(int));
        dt.Columns.Add("TagName", typeof(string));

        // Örnek veriler - blog ID'ye göre
        if (blogId == 1)
        {
            dt.Rows.Add(1, "ASP.NET");
            dt.Rows.Add(2, "Web Geliştirme");
            dt.Rows.Add(3, "C#");
            dt.Rows.Add(4, ".NET Framework");
        }
        else if (blogId == 2)
        {
            dt.Rows.Add(5, "SQL Server");
            dt.Rows.Add(6, "Veritabanı");
            dt.Rows.Add(7, "Normalleştirme");
            dt.Rows.Add(8, "Tasarım");
        }
        else if (blogId == 3)
        {
            dt.Rows.Add(9, "HTML5");
            dt.Rows.Add(10, "CSS3");
            dt.Rows.Add(11, "JavaScript");
            dt.Rows.Add(12, "Responsive");
            dt.Rows.Add(13, "UI/UX");
        }

        return dt;
    }
    
    private void IncrementViewCount()
    {
        try
        {
            // Veritabanında blog görüntülenme sayısını artır
            // Bu bir simülasyondur, gerçek veritabanı kodları eklenmelidir
            System.Diagnostics.Debug.WriteLine($"Blog ID {blogId} için görüntülenme sayısı artırıldı.");
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Görüntülenme sayısı artırılırken hata: " + ex.Message);
        }
    }
    
    private void LoadComments()
    {
        try
        {
            // Veritabanından blog yorumlarını çek
            DataTable dt = GetCommentsFromDatabase(blogId);
            
            // Repeater'a veri bağla
            rptComments.DataSource = dt;
            rptComments.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Blog yorumları yüklenirken hata: " + ex.Message);
        }
    }
    
    private DataTable GetCommentsFromDatabase(int blogId)
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("CommentID", typeof(int));
        dt.Columns.Add("BlogID", typeof(int));
        dt.Columns.Add("UserID", typeof(int));
        dt.Columns.Add("UserName", typeof(string));
        dt.Columns.Add("CommentText", typeof(string));
        dt.Columns.Add("CommentDate", typeof(DateTime));
        dt.Columns.Add("LikeCount", typeof(int));

        // Örnek veriler - blog ID'ye göre
        if (blogId == 1)
        {
            dt.Rows.Add(1, 1, 101, "Mehmet Yılmaz", "Harika bir yazı olmuş, teşekkürler! ASP.NET ile ilgili daha fazla içerik paylaşmanızı bekliyorum.", DateTime.Now.AddDays(-4), 5);
            dt.Rows.Add(2, 1, 102, "Ayşe Kaya", "Yazınız sayesinde ASP.NET hakkında daha fazla bilgi sahibi oldum. Özellikle MVC ve Web Forms karşılaştırması çok faydalıydı.", DateTime.Now.AddDays(-3), 3);
            dt.Rows.Add(3, 1, 103, "Ali Demir", "Başlangıç seviyesindeki bir geliştirici için çok açıklayıcı bir yazı, teşekkürler.", DateTime.Now.AddDays(-2), 2);
        }
        else if (blogId == 2)
        {
            dt.Rows.Add(4, 2, 104, "Zeynep Çelik", "Veritabanı normalleştirme konusunda ek kaynak önerebilir misiniz?", DateTime.Now.AddDays(-2), 1);
            dt.Rows.Add(5, 2, 105, "Mustafa Yıldız", "NoSQL veritabanları hakkında daha detaylı bir yazı yazmanızı rica edebilir miyim?", DateTime.Now.AddDays(-1), 0);
        }
        else if (blogId == 3)
        {
            dt.Rows.Add(6, 3, 106, "Selin Kara", "Modern web tasarımı hakkında harika bilgiler içeren bir yazı olmuş. Figma kullanımı hakkında da bir yazı yazarsanız çok faydalı olur.", DateTime.Now.AddDays(-1), 7);
            dt.Rows.Add(7, 3, 107, "Cem Yılmaz", "Koyu mod tasarımı için önerdiğiniz renk paletleri var mı?", DateTime.Now.AddHours(-12), 2);
            dt.Rows.Add(8, 3, 108, "Deniz Arslan", "Mikro etkileşimler için hangi JavaScript kütüphanelerini önerirsiniz?", DateTime.Now.AddHours(-6), 1);
            dt.Rows.Add(9, 3, 101, "Mehmet Yılmaz", "CSS Grid ve Flexbox kullanımı hakkında daha fazla bilgi verir misiniz?", DateTime.Now.AddHours(-2), 0);
        }

        return dt;
    }
    
    private void LoadRelatedPosts()
    {
        try
        {
            // Veritabanından ilgili blog yazılarını çek
            DataTable dt = GetRelatedPostsFromDatabase(blogId);
            
            // Repeater'a veri bağla
            rptRelatedPosts.DataSource = dt;
            rptRelatedPosts.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("İlgili yazılar yüklenirken hata: " + ex.Message);
        }
    }
    
    private DataTable GetRelatedPostsFromDatabase(int blogId)
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("ID", typeof(int));
        dt.Columns.Add("Title", typeof(string));
        dt.Columns.Add("ImageUrl", typeof(string));
        dt.Columns.Add("PublishedDate", typeof(DateTime));
        dt.Columns.Add("ViewCount", typeof(int));

        // Bu blog dışındaki tüm blogları göster (gerçek senaryoda kategori veya etiket bazlı ilişki kurulabilir)
        if (blogId != 1)
            dt.Rows.Add(1, "ASP.NET ile Web Geliştirme", "Images/blog1.jpg", DateTime.Now.AddDays(-5), 125);
        if (blogId != 2)
            dt.Rows.Add(2, "Veritabanı Tasarımı", "Images/blog2.jpg", DateTime.Now.AddDays(-3), 87);
        if (blogId != 3)
            dt.Rows.Add(3, "Modern Web Tasarımı", "Images/blog3.jpg", DateTime.Now.AddDays(-1), 210);
        
        // Ek ilgili blog yazıları
        dt.Rows.Add(4, "Bulut Teknolojileri", "Images/blog4.jpg", DateTime.Now.AddDays(-7), 98);
        dt.Rows.Add(5, "NoSQL Çözümleri", "Images/blog5.jpg", DateTime.Now.AddDays(-10), 74);

        return dt;
    }
    
    private void CheckUserLogin()
    {
        // Kullanıcı giriş yapmış mı kontrol et
        if (Session["UserID"] != null)
        {
            // Kullanıcı giriş yapmış, yorum formunu göster
            pnlCommentForm.Visible = true;
            pnlLoginToComment.Visible = false;
        }
        else
        {
            // Kullanıcı giriş yapmamış, login mesajını göster
            pnlCommentForm.Visible = false;
            pnlLoginToComment.Visible = true;
        }
    }

    protected string GetUserAvatarUrl(string userId)
    {
        // Bu metod kullanıcı ID'sine göre avatar URL'si döndürür
        // Gerçek senaryoda veritabanından çekilebilir
        return "Images/avatars/user" + userId + ".jpg";
    }

    protected bool CanDeleteComment(string commentUserId)
    {
        // Bu metod, yorum sahibi veya admin ise yorumu silebilme yetkisi verir
        if (Session["UserID"] != null)
        {
            string currentUserId = Session["UserID"].ToString();
            bool isAdmin = Session["IsAdmin"] != null && Convert.ToBoolean(Session["IsAdmin"]);
            
            return currentUserId == commentUserId || isAdmin;
        }
        
        return false;
    }

    protected void btnBackToBlog_Click(object sender, EventArgs e)
    {
        // Bir önceki sayfaya dön
        if (Request.UrlReferrer != null)
        {
            Response.Redirect(Request.UrlReferrer.ToString());
        }
        else
        {
            // Referrer yoksa ana sayfaya yönlendir
            Response.Redirect("~/Default.aspx");
        }
    }

    protected void btnLike_Click(object sender, EventArgs e)
    {
        // Kullanıcı giriş yapmış mı kontrol et
        if (Session["UserID"] != null)
        {
            try
            {
                // Blog beğeni sayısını artır
                // Bu bir simülasyondur, gerçek veritabanı kodları eklenmelidir
                int currentLikes = Convert.ToInt32(likeCount.InnerText);
                likeCount.InnerText = (currentLikes + 1).ToString();
                
                System.Diagnostics.Debug.WriteLine($"Blog ID {blogId} için beğeni sayısı artırıldı.");
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yapılabilir
                System.Diagnostics.Debug.WriteLine("Beğeni sayısı artırılırken hata: " + ex.Message);
            }
        }
        else
        {
            // Kullanıcı giriş yapmamış, login sayfasına yönlendir
            Response.Redirect("~/Login.aspx");
        }
    }

    protected void btnSubmitComment_Click(object sender, EventArgs e)
    {
        // Kullanıcı giriş yapmış mı kontrol et
        if (Session["UserID"] != null)
        {
            try
            {
                // Yorum metnini al
                string commentText = txtCommentText.Text.Trim();
                
                if (!string.IsNullOrEmpty(commentText))
                {
                    // Yorumu veritabanına kaydet
                    // Bu bir simülasyondur, gerçek veritabanı kodları eklenmelidir
                    
                    // Yorum sayısını artır
                    int currentComments = Convert.ToInt32(commentCount.InnerText);
                    commentCount.InnerText = (currentComments + 1).ToString();
                    
                    // Form alanını temizle
                    txtCommentText.Text = string.Empty;
                    
                    // Yorumları yeniden yükle
                    LoadComments();
                    
                    System.Diagnostics.Debug.WriteLine($"Blog ID {blogId} için yeni yorum eklendi.");
                }
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yapılabilir
                System.Diagnostics.Debug.WriteLine("Yorum eklenirken hata: " + ex.Message);
            }
        }
        else
        {
            // Kullanıcı giriş yapmamış, login sayfasına yönlendir
            Response.Redirect("~/Login.aspx");
        }
    }

    protected void btnLoginToComment_Click(object sender, EventArgs e)
    {
        // Login sayfasına yönlendir
        Response.Redirect("~/Login.aspx");
    }

    protected void rptComments_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        // Kullanıcı giriş yapmış mı kontrol et
        if (Session["UserID"] != null)
        {
            int commentId = Convert.ToInt32(e.CommandArgument);
            
            switch (e.CommandName)
            {
                case "LikeComment":
                    // Yorum beğeni sayısını artır
                    // Bu bir simülasyondur, gerçek veritabanı kodları eklenmelidir
                    System.Diagnostics.Debug.WriteLine($"Yorum ID {commentId} için beğeni sayısı artırıldı.");
                    break;
                    
                case "ReplyComment":
                    // Yorum yanıtlama işlevi
                    // Bu kısım daha sonra eklenecek
                    System.Diagnostics.Debug.WriteLine($"Yorum ID {commentId} için yanıt formu açıldı.");
                    break;
                    
                case "DeleteComment":
                    // Yorumu sil
                    // Bu bir simülasyondur, gerçek veritabanı kodları eklenmelidir
                    System.Diagnostics.Debug.WriteLine($"Yorum ID {commentId} silindi.");
                    
                    // Yorum sayısını azalt
                    int currentComments = Convert.ToInt32(commentCount.InnerText);
                    if (currentComments > 0)
                    {
                        commentCount.InnerText = (currentComments - 1).ToString();
                    }
                    
                    // Yorumları yeniden yükle
                    LoadComments();
                    break;
            }
        }
        else
        {
            // Kullanıcı giriş yapmamış, login sayfasına yönlendir
            Response.Redirect("~/Login.aspx");
        }
    }
}
