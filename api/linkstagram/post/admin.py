from django.contrib import admin

from .models import Post, PostImage


# Register your models here.
#
#
# class PostImageAdmin(admin.StackedInline):
#     model = PostImage
#
#
# @admin.register(Post)
# class PostAdmin(admin.ModelAdmin):
#     inlines = [PostImageAdmin]
#
#     class Meta:
#         model = Post
#
#
# @admin.register(PostImage)
# class PostImageAdmin(admin.ModelAdmin):
#     pass
#

class PostImageInline(admin.StackedInline):
    model = PostImage
    extra = 3


class PostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline, ]


admin.site.register(Post, PostAdmin)
