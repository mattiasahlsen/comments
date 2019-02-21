<template>



<div class="grey alert">





        <button type="button" class="close nostyle" data-dismiss="alert" aria-label="Close"
          @click.prevent="addUrl = false">
          <span aria-hidden="true">&times;</span>
        </button>

        <span>There is currently no comment field for this URL.</span>

        <p v-if="cache[parsedUrl.origin]">
          There is a comment field
          <i>{{parsedUrl.origin}}</i>, do you want to
          <button class="" @click="redirect(parsedUrl.origin)">go there?</button>
        </p>

        <p>
					Do you want to
          <button class="" @click="newCommentField(parsedUrl.href)">
            create a new one
          </button> for <i>{{parsedUrl.href}}</i>?
        </p>

<p v-if="!cache[parsedUrl.origin] && parsedUrl.origin !== parsedUrl.href">
Or
<button class="" @click="newCommentField(parsedUrl.origin)">
create a domain-wide
</button> for <i>{{parsedUrl.origin}}</i>?
</p>
<p v-else>All URLs are normalized to http.<p/>





</div>









</template>
