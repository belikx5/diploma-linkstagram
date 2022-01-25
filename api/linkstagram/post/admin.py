from django.contrib import admin

from .models import Post, PostImage, PostComment, PostLike


class PostLikeInline(admin.StackedInline):
    model = PostLike
    extra = 1


class PostCommentInline(admin.StackedInline):
    model = PostComment
    extra = 2


class PostImageInline(admin.StackedInline):
    model = PostImage
    extra = 2


class PostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline, PostCommentInline, PostLikeInline, ]


admin.site.register(Post, PostAdmin)
